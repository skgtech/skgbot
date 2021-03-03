/**
 * @fileoverview Join a topic category.
 */

const config = require('config');

const { categoryJoined, categoryInvalid } = require('../messages');
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
  const category = entity.sanitize(cmdArgument);
  await log.info(`Member wants to join new Category: "${category}"`, {
    localMember,
    relay: true,
  });

  if (!entity.validateCategory(category)) {
    await message.channel.send(categoryInvalid());
    return;
  }

  const guild = await getGuild(message);
  const guildMember = await getGuildMember(message);

  // Get the actual string literal of the category name
  const canonicalCategory = entity.getCanonical(category);

  const role = getRole(guild, canonicalCategory);

  await guildMember.roles.add(role);

  await message.channel.send(categoryJoined(canonicalCategory));
};

/**
 * Validates a category.
 *
 * @param {string} category The category to validate.
 * @return {boolean} True if it passes validation.
 */
entity.validateCategory = (category) => {
  return config.discord.roles_all_available_lowercase.includes(category);
};

/**
 * Sanitizes the raw input into a lowercased, trimmed category name.
 *
 * @param {string} cmdArgument Raw input of user.
 * @return {string} sanitized category.
 */
entity.sanitize = (cmdArgument) => {
  return cmdArgument.trim().toLowerCase();
};

/**
 * Returns the canonical name of the category. In order to properly validate
 * and handle user case-insensitive inputs, we have two arrays of roles in the
 * config:
 *
 * * config.discord.roles_all_available - CANONICAL
 * * config.discord.roles_all_available_lowercase - LOWERCASED
 *
 * This function, resolves the lowercased role to the canonical name.
 *
 * @param {string} category Lowercased category name.
 * @return {string} Canonical category name.
 */
entity.getCanonical = (category) => {
  const index = config.discord.roles_all_available_lowercase.findIndex(
    category,
  );

  return config.discord.roles_all_available[index];
};
