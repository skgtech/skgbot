/**
 * @fileoverview Various discord helpers, queries and methods.
 */

const config = require('config');

const { getClient } = require('../../services/discord.service');

const entity = (module.exports = {});

/**
 * Gets the guildmember instance from a discord message instance.
 *
 * @param {DiscordMessage} message A dicord member instance.
 * @return {Promise<DiscordGuildMember>} Returns the guildmember instance.
 */
entity.getGuildMember = async (message) => {
  const guildMember = await getClient()
    .guilds.cache.get(config.discord.guild_id)
    .members.fetch(message.author.id);

  return guildMember;
};

/**
 * Gets the Guild Object the bot is responsible for.
 *
 * @return {Promise<DiscordGuild>} Returns the guild instance.
 */
entity.getGuild = async () => {
  const guild = await getClient().guilds.cache.get(config.discord.guild_id);

  return guild;
};

/**
 * Returns the role discord object.
 *
 * @param {DiscordGuild} guild The guild to look the role into.
 * @param {string} roleName The role name to look for.
 * @return {DiscordRole} Returns the discord role.
 */
entity.getRole = (guild, roleName) => {
  const role = guild.roles.member.guild.roles.cache.find(
    (roleItem) => roleItem.name === roleName,
  );

  return role;
};
