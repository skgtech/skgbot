/**
 * @fileoverview Will prevent a member from joining the topic category defined.
 */

const { create } = require('../sql/moderation.sql');
const { failed, banSuccess } = require('../messages');
const { removeRole, removeAllRoles } = require('../../discord');
const { getById } = require('../../members/sql/members.sql');
const { sanitizeAndValidate } = require('../../categories');
const log = require('../../../services/log.service').get();

const entity = (module.exports = {});

/**
 * Will prevent a member from joining the topic category defined.
 * Use a wildcard "*" to not allow the member join any category.
 *
 * Access Control has already been performed.
 *
 * @param {DiscordMessage} message incoming private discord message.
 * @param {Member} localMember The local member record of the moderator.
 * @return {Promise<void>} A Promise.
 */
entity.moderationBan = async (message, localMember) => {
  const [, discordMemberId, categoryRaw, ...reasonAr] = message.content.split(
    ' ',
  );
  const reason = reasonAr.join(' ');

  // get proper category name, account for wildcard.
  let category = '';
  if (categoryRaw === '*') {
    category = '*';
  } else {
    category = await sanitizeAndValidate(message, categoryRaw);
  }

  try {
    const targetMember = await getById(discordMemberId);
    await entity._removeRole(discordMemberId, targetMember, category);
    const createData = {
      discord_uid: discordMemberId,
      moderator_discord_uid: localMember.discord_uid,
      category,
      reason,
    };

    await create(createData);

    await entity._logBan(
      discordMemberId,
      targetMember,
      localMember,
      category,
      reason,
    );
  } catch (ex) {
    await message.channel.send(failed());
    await log.error('moderationBan() Failed', {
      error: ex,
      localMember,
    });
    return;
  }

  await message.channel.send(banSuccess(discordMemberId, category));
};

/**
 * Apply the ban, remove the target role.
 *
 * @param {DiscordMemberId} discordMemberId Discord Member id to remove role from.
 * @param {?Member} targetMember Target member to be banned, local record, could
 *  be empty.
 * @param {string} category Canonical category name or wildcard.
 * @return {Promise<void>} A Promise.
 * @private
 */
entity._removeRole = async (discordMemberId, targetMember, category) => {
  if (!targetMember) {
    // member not found in local database.
    return;
  }

  if (category === '*') {
    await removeAllRoles(discordMemberId);
  } else {
    await removeRole(discordMemberId, category);
  }
};

/**
 * Log the ban appropriately.
 *
 * @param {DiscordMemberId} discordMemberId Discord Member id to remove role from.
 * @param {?Member} targetMember Target member to be banned, local record, could
 *  be empty.
 * @param {Member} localMember Moderator local record.
 * @param {string} category Canonical category name or wildcard.
 * @param {string} reason The reason for banning.
 * @return {Promise<void>}
 * @private
 */
entity._logBan = async (
  discordMemberId,
  targetMember,
  localMember,
  category,
  reason,
) => {
  let targetMemberDetails = '';
  if (targetMember) {
    targetMemberDetails = `${targetMember.nickname} [${targetMember.email}]`;
  }
  await log.info(
    `Member banned by ${localMember.nickname}. Banned user` +
      ` ${discordMemberId} ${targetMemberDetails}, for category ${category}` +
      ` Reason: ${reason}`,
    {
      localMember,
      relay: true,
      emoji: ':no_entry:',
    },
  );
};
