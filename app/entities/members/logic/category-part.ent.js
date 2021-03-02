/**
 * @fileoverview Part a topic category.
 */

const { categoryParted, categoryInvalid } = require('../messages');
const { getGuild, getGuildMember, getRole } = require('../../discord');
const log = require('../../../services/log.service').get();
const { validateCategory } = require('./category-join.ent');

const entity = (module.exports = {});

/**
 * Part a topic category.
 *
 * @param {DiscordMessage} message The incoming message.
 * @param {Member} localMember The fetched local member.
 * @param {string} category The category to part.
 * @return {Promise<void>}
 */
entity.categoryPart = async (message, localMember, category) => {
  await log.info(`Member wants to part category: "${category}"`, {
    localMember,
    relay: true,
  });

  if (!validateCategory(category)) {
    await message.channel.send(categoryInvalid());
    return;
  }

  const guild = await getGuild(message);
  const guildMember = await getGuildMember(message);

  const role = getRole(guild, category);

  await guildMember.roles.remove(role);

  await message.channel.send(categoryParted(category));
};
