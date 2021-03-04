/**
 * @fileoverview Determines if the member sending the message is a moderator.
 */

const config = require('config');
const { getGuildMember } = require('../../discord');

const entity = (module.exports = {});

/**
 * Determines if the member sending the message is a moderator.
 *
 * @param {DiscordMessage} message incoming private discord message.
 * @return {Promise<boolean>} True if they are.
 */
entity.isModerator = async (message) => {
  const guildMember = await getGuildMember(message);

  if (!guildMember) {
    return false;
  }

  if (guildMember.roles.cache.has(config.discord.moderator_role_id)) {
    return true;
  }
  return false;
};
