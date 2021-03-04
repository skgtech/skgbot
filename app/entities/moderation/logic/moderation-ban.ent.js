/**
 * @fileoverview Will prevent a member from joining the topic category defined.
 */

const { sanitizeAndValidate } = require('../../categories');
const { create } = require('../sql/moderation.sql');
const { failed, banSuccess } = require('../messages');
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
  const [, memberDiscordId, categoryRaw, ...reasonAr] = message.content.split(
    ' ',
  );
  const reason = reasonAr.join(' ');

  const category = await sanitizeAndValidate(categoryRaw);

  try {
    const createData = {
      discord_uid: memberDiscordId,
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

  await message.channel.send(banSuccess(memberDiscordId, category));
};
