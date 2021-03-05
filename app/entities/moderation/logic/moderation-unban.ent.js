/**
 * @fileoverview Will remove an added category topic ban.
 */

const { deleteCombined, getById } = require('../sql/moderation.sql');
const { failed, unbanSuccess } = require('../messages');
const log = require('../../../services/log.service').get();

const entity = (module.exports = {});

/**
 * Will remove an added category topic ban.
 *
 * Access Control has already been performed.
 *
 * @param {DiscordMessage} message incoming private discord message.
 * @param {Member} localMember The local member.
 * @return {Promise<void>} A Promise.
 */
entity.moderationUnban = async (message, localMember) => {
  const [, discordMemberId, category] = message.content.split(' ');

  let deleted;
  try {
    const targetMember = await getById(discordMemberId);
    deleted = await deleteCombined(discordMemberId, category);
    await message.channel.send(
      unbanSuccess(discordMemberId, category, deleted),
    );

    await entity._logBan(discordMemberId, targetMember, localMember, category);
  } catch (ex) {
    await message.channel.send(failed());
    await log.error('moderationBan() Failed', {
      error: ex,
      localMember,
    });
  }
};

/**
 * Log the ban removal appropriately.
 *
 * @param {DiscordMemberId} discordMemberId Discord Member id to remove role from.
 * @param {?Member} targetMember Target member to be banned, local record, could
 *  be empty.
 * @param {Member} localMember Moderator local record.
 * @param {string} category Canonical category name or wildcard.
 * @return {Promise<void>}
 * @private
 */
entity._logBan = async (
  discordMemberId,
  targetMember,
  localMember,
  category,
) => {
  let targetMemberDetails = '';
  if (targetMember) {
    targetMemberDetails = `${targetMember.nickname} [${targetMember.email}]`;
  }
  await log.info(
    `Member ban removed by ${localMember.nickname}. Banned user` +
      ` ${discordMemberId} ${targetMemberDetails}, for category ${category}`,
    {
      localMember,
      relay: true,
      emoji: ':green_circle:',
    },
  );
};
