/**
 * @fileoverview Handles Member commands.
 */

const messages = require('../messages');
const {
  showProfile,
  changeNickname,
  changeBio,
  categoryJoin,
  categoryPart,
} = require('../../members');

const { moderationBan, moderationUnban } = require('../../moderation');

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
      await changeBio(message, localMember, message.content);
      break;
    case '!join': // Join a Category.
      await categoryJoin(message, localMember, cmdArgument);
      break;
    case '!part': // Part a Category.
      await categoryPart(message, localMember, cmdArgument);
      break;
    case '!ban': // Do not allow a user from joining the specified topic category.
      await moderationBan(message, localMember);
      break;
    case '!unban': // Allow a user from joining the specified topic category.
      await moderationUnban(message, localMember);
      break;
    default:
      await message.channel.send(messages.error());
      break;
  }
};
