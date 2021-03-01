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
 * @param {string} category The category to join.
 * @return {Promise<void>}
 */
entity.categoryJoin = async (message, localMember, category) => {
  log.info(`Member wants to join new Category: "${category}"`, { localMember });

  if (!entity.validateCategory(category)) {
    message.channel.send(categoryInvalid());
    return;
  }

  const guild = await getGuild(message);
  const guildMember = await getGuildMember(message);

  const role = getRole(guild, category);

  await guildMember.roles.add(role);

  message.channel.send(categoryJoined(category));
};

/**
 * Validates a category.
 *
 * @param {string} category The category to validate.
 * @return {boolean} True if it passes validation.
 */
entity.validateCategory = (category) => {
  return config.discord.roles_all_available.includes(category);
};
