/**
 * @fileoverview Join a topic category.
 */

const { sanitizeAndValidate } = require('../../categories');

const { categoryJoined, alreadyJoined, failed } = require('../messages');
const { getGuild, getGuildMember, getRole } = require('../../discord');
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
  const guild = await getGuild(message);
  const guildMember = await getGuildMember(message);

  const role = getRole(guild, category);

  // Check if member already joined
  if (guildMember.roles.cache.has(role.id)) {
    await message.channel.send(alreadyJoined(category));
    return;
  }

  try {
    await guildMember.roles.add(role);
    await message.channel.send(categoryJoined(category));
  } catch (ex) {
    await log.error('categoryJoin() :: Failed to add role', {
      localMember,
      error: ex,
      custom: {
        role,
      },
    });
    await message.channel.send(failed());
  }
};
