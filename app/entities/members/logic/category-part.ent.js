/**
 * @fileoverview Part a topic category.
 */

const { sanitizeAndValidate } = require('../../categories');
const { categoryParted, alreadyParted, failed } = require('../messages');
const { getGuild, getGuildMember, getRole } = require('../../discord');
const log = require('../../../services/log.service').get();

const entity = (module.exports = {});

/**
 * Part a topic category.
 *
 * @param {DiscordMessage} message The incoming message.
 * @param {Member} localMember The fetched local member.
 * @param {string} categoryRaw User input for category to join.
 * @return {Promise<void>}
 */
entity.categoryPart = async (message, localMember, categoryRaw) => {
  await log.info(`Member wants to part category: "${categoryRaw}"`, {
    localMember,
    relay: true,
    emoji: ':thumbsdown:',
  });
  const category = await sanitizeAndValidate(categoryRaw);

  const guild = await getGuild(message);
  const guildMember = await getGuildMember(message);

  const role = getRole(guild, category);

  // Check if member already joined
  if (!guildMember.roles.cache.has(role.id)) {
    await message.channel.send(alreadyParted(category));
    return;
  }

  try {
    await guildMember.roles.remove(role);
    await message.channel.send(categoryParted(category));
  } catch (ex) {
    await log.error('categoryPart() :: Failed to add role', {
      localMember,
      error: ex,
      custom: {
        role,
      },
    });
    await message.channel.send(failed());
  }
};
