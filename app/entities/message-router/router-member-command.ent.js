/**
 * @fileoverview Handles Member commands.
 */

const messages = require('./messages');
const { showProfile } = require('../members');

const router = (module.exports = {});

/**
 * Handles commands from members.
 *
 * @param {DiscordMessage} message The incoming message.
 * @param {Member} localMember The local member.
 * @return {Promise<void>} A Promise.
 * @private
 */
router.handleMemberCommands = async (message, localMember) => {
  const [command, cmdArgument] = message.content.split(' ');

  switch (command) {
    case '!help':
      await message.channel.send(messages.help());
      break;
    case '!profile':
      await showProfile(message, localMember, cmdArgument);
      break;

    default:
      await message.channel.send(messages.error());
      break;
  }
};
