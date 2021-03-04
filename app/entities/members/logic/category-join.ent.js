/**
 * @fileoverview Join a topic category.
 */

const { sanitizeAndValidate } = require('../../categories');
const { categoryJoined, alreadyJoined, failed } = require('../messages');
const { addRole } = require('../../discord');
const log = require('../../../services/log.service').get();

const entity = (module.exports = {});

/**
 * Join a topic category.
 *
 * @param {DiscordMessage} message The incoming message.
 * @param {Member} localMember The fetched local member.
 * @param {string} categoryRaw Member raw input for category to join.
 * @return {Promise<void>}
 */
entity.categoryJoin = async (message, localMember, categoryRaw) => {
  await log.info(`Member wants to join new Category: "${categoryRaw}"`, {
    localMember,
    relay: true,
    emoji: ':thumbsup:',
  });

  const category = await sanitizeAndValidate(categoryRaw);

  try {
    const hasRole = await addRole(localMember.discord_uid, category);
    if (hasRole) {
      await message.channel.send(alreadyJoined(category));
    } else {
      await message.channel.send(categoryJoined(category));
    }
  } catch (ex) {
    await log.error('categoryJoin() :: Failed to add role', {
      localMember,
      error: ex,
      custom: {
        category,
      },
    });
    await message.channel.send(failed());
  }
};
