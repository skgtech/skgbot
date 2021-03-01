/**
 * @fileoverview Handles Member commands.
 */

const messages = require('./messages');
const { startOnboarding } = require('../onboarding');

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
  const parts = message.content.split(' ');

  switch (parts[0]) {
    case '!help':
      await message.channel.send(messages.help());
      break;
    case '!register':
      await startOnboarding(message, localMember);
      break;

    // Resend the email verification code.
    case '!resend':
      break;
    default:
      await message.channel.send(messages.error());
      break;
  }
};