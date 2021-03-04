/**
 * @fileoverview Will prevent a member from joining the topic category defined.
 */

const config = require('config');
const { getGuildMember } = require('../../discord');
const { failed } = require('../messages');
const log = require('../../../services/log.service').get();

const entity = (module.exports = {});

/**
 * Will prevent a member from joining the topic category defined.
 * Use a wildcard "*" to not allow the member join any category.
 *
 * @param {DiscordMessage} message incoming private discord message.
 * @param {Member} localMember The local member.
 * @return {Promise<void>} A Promise.
 */
entity.moderationBan = async (message, localMember) => {
  const guildMember = await getGuildMember(message);

  if (!guildMember) {
    log.warn('moderationBan() :: Could not locate guildmember', {
      localMember,
    });
    await message.channel.send(failed());
    return;
  }

  if (guildMember.roles.cache.has(config.discord.moderator_role_id)) {
    return true;
  }
  return false;
};
