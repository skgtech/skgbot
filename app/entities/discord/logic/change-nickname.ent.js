/**
 * @fileoverview Changes the nickname of a discord member.
 */

const { getGuildMember } = require('./guild.ent');
const log = require('../../../services/log.service').get();

const entity = (module.exports = {});

/**
 * Set the member's nickname on discord.
 *
 * @param {DiscordMessage} message The discord message.
 * @param {Member} localMember Local record of the member.
 * @param {string} nickname The nickname to set the user with.
 * @return {Promise<void>} A Promise.
 */
entity.setNickname = async (message, localMember, nickname) => {
  const guildMember = await getGuildMember(message);
  try {
    await guildMember.setNickname(nickname);
  } catch (ex) {
    await log.error('Failed to set nickname', {
      localMember,
      error: ex,
      custom: { nickname },
    });

    // do not propagate error on purpose.
  }
};
