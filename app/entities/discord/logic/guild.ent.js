/**
 * @fileoverview Guild related methods.
 */

const config = require('config');

const { getClient } = require('../../../services/discord.service');

const entity = (module.exports = {});

/**
 * Gets the guildmember instance from a discord message instance.
 *
 * @param {DiscordMessage} message A discord member instance.
 * @return {Promise<DiscordGuildMember>} Returns the guildmember instance.
 */
entity.getGuildMember = async (message) => {
  return entity.getGuildMemberUid(message.author.id);
};

/**
 * Gets the guildmember instance from a localMember record.
 *
 * @param {Member} localMember A local member record.
 * @return {Promise<DiscordGuildMember>} Returns the guildmember instance.
 */
entity.getGuildMemberLocal = async (localMember) => {
  return entity.getGuildMemberUid(localMember.discord_uid);
};

/**
 * Gets the guildmember instance from a discord member id.
 *
 * @param {DiscordMemberId} discordMemberId Discord member id.
 * @return {Promise<DiscordGuildMember>} Returns the guildmember instance.
 */
entity.getGuildMemberUid = async (discordMemberId) => {
  const guildMember = await getClient()
    .guilds.cache.get(config.discord.guild_id)
    .members.fetch(discordMemberId);

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
