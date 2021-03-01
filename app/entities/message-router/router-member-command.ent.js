/**
 * @fileoverview Handles Member commands.
 */

const messages = require('./messages');
const { showProfile, changeNickname, changeBio } = require('../members');

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
    case '!profile': // show a member's profile
      await showProfile(message, localMember, cmdArgument);
      break;
    case '!nickname': // Change member's nickname.
      await changeNickname(message, localMember, cmdArgument);
      break;
    case '!bio': // Change member's bio.
      await changeBio(message, localMember, cmdArgument);
      break;
    case '!join': // Join a Category.
      break;
    case '!part': // Part a Category.
      break;

    default:
      await message.channel.send(messages.error());
      break;
  }
};
