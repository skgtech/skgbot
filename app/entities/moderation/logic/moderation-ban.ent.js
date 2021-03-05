/**
 * @fileoverview Will prevent a member from joining the topic category defined.
 */

const { sanitizeAndValidate } = require('../../categories');
const { create } = require('../sql/moderation.sql');
const { failed, banSuccess } = require('../messages');
const { removeRole, removeAllRoles } = require('../../discord');
const { getById } = require('../../members');
const log = require('../../../services/log.service').get();

const entity = (module.exports = {});

/**
 * Will prevent a member from joining the topic category defined.
 * Use a wildcard "*" to not allow the member join any category.
 *
 * Access Control has already been performed.
 *
 * @param {DiscordMessage} message incoming private discord message.
 * @param {Member} localMember The local member.
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
    await entity._removeRole(discordMemberId, category);
    const createData = {
      discord_uid: discordMemberId,
      moderator_discord_uid: localMember.discord_uid,
      category,
      reason,
    };

    await create(createData);
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
 * @param {string} category Canonical category name or wildcard.
 * @return {Promise<void>} A Promise.
 * @private
 */
entity._removeRole = async (discordMemberId, category) => {
  const targetMember = await getById(discordMemberId);

  if (!targetMember) {
    // member not found in local database.
    return;
  }

  if (category === '*') {
    await removeAllRoles(discordMemberId);
  } else {
    await removeRole(category);
  }
};
