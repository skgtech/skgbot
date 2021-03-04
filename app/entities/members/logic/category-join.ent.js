/**
 * @fileoverview Join a topic category.
 */

const {
  sanitize,
  validateCategory,
  getCanonical,
} = require('../../categories');

const {
  categoryJoined,
  categoryInvalid,
  alreadyJoined,
  failed,
} = require('../messages');
const { getGuild, getGuildMember, getRole } = require('../../discord');
const log = require('../../../services/log.service').get();

const entity = (module.exports = {});

/**
 * Join a topic category.
 *
 * @param {DiscordMessage} message The incoming message.
 * @param {Member} localMember The fetched local member.
 * @param {string} cmdArgument User input for category to join.
 * @return {Promise<void>}
 */
entity.categoryJoin = async (message, localMember, cmdArgument) => {
  const category = sanitize(cmdArgument);
  await log.info(`Member wants to join new Category: "${category}"`, {
    localMember,
    relay: true,
    emoji: ':thumbsup:',
  });

  if (!validateCategory(category)) {
    await message.channel.send(categoryInvalid());
    return;
  }

  const guild = await getGuild(message);
  const guildMember = await getGuildMember(message);

  // Get the actual string literal of the category name
  const canonicalCategory = getCanonical(category);

  const role = getRole(guild, canonicalCategory);

  // Check if member already joined
  if (guildMember.roles.cache.has(role.id)) {
    await message.channel.send(alreadyJoined(canonicalCategory));
    return;
  }

  try {
    await guildMember.roles.add(role);
    await message.channel.send(categoryJoined(canonicalCategory));
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
