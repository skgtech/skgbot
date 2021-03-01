/**
 * @fileoverview Handles commands avaialble during onboarding.
 */

const messages = require('./messages');
const { resendVerification, resetOnboarding } = require('../onboarding');
const { getGuildMember } = require('../../services/discord.service');

const router = (module.exports = {});

/**
 * Handles commands from members.
 *
 * @param {DiscordMessage} message The incoming message.
 * @param {Member} localMember The local member.
 * @return {Promise<void>} A Promise.
 * @private
 */
router.handleOnboardingCommands = async (message, localMember) => {
  const parts = message.content.split(' ');

  const guildMember = await getGuildMember(message);

  switch (parts[0]) {
    case '!help':
      await message.channel.send(messages.helpOnboarding());
      break;

    // Resend the email verification code.
    case '!resend':
      await resendVerification(message, localMember);
      break;
    case '!reset':
      await resetOnboarding(guildMember);
      break;
    default:
      await message.channel.send(messages.error());
      break;
  }
};
