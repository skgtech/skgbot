/**
 * @fileoverview Will remove an added category topic ban.
 */

const { deleteCombined } = require('../sql/moderation.sql');
const { failed, unbanSuccess } = require('../messages');
const log = require('../../../services/log.service').get();

const entity = (module.exports = {});

/**
 * Will remove an added category topic ban.
 *
 * Access Control has been already performed.
 *
 * @param {DiscordMessage} message incoming private discord message.
 * @param {Member} localMember The local member.
 * @return {Promise<void>} A Promise.
 */
entity.moderationUnban = async (message, localMember) => {
  const [, memberDiscordId, category] = message.content;

  let deleted;
  try {
    deleted = await deleteCombined(memberDiscordId, category);
  } catch (ex) {
    await message.channel.send(failed());
    await log.error('moderationBan() Failed', {
      error: ex,
      localMember,
    });
  }

  await message.channel.send(unbanSuccess(memberDiscordId, category, deleted));
};
