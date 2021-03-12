/**
 * @fileoverview Handles commands avaialble during onboarding.
 */

const messages = require('../messages');
const {
  resendVerification,
  sendFirstOnboardingDM,
} = require('../../onboarding');
const { resetOnboarding } = require('../../members');
const { getGuildMember } = require('../../discord');

const router = (module.exports = {});

/**
 * Handles commands from members.
 *
 * @param {DiscordMessage} message The incoming message.
 * @param {Member} localMember The local member.
 * @return {Promise<void>} A Promise.
 */
router.handleOnboardingCommands = async (message, localMember) => {
  const parts = message.content.split(' ');

  const guildMember = await getGuildMember(message);

  switch (parts[0]) {
    case '!help':
      await message.channel.send(messages.helpOnboarding());
      await router._sendOnboardingHelp(message, localMember);
      break;

    // Resend the email verification code.
    case '!resend':
      await resendVerification(message, localMember);
      break;
    case '!reset':
      await router._handleResetOnboarding(guildMember);
      break;
    default:
      await message.channel.send(messages.error());
      break;
  }
};

/**
 * Handle reset onboarding operation.
 *
 * @param {DiscordGuildMember} guildMember The guildmember object.
 * @return {Promise<void>}
 * @private
 */
router._handleResetOnboarding = async (guildMember) => {
  const localMember = await resetOnboarding(guildMember);
  await sendFirstOnboardingDM(guildMember, localMember);
};

/**
 * Will send a help message to the member based on their onboarding status.
 *
 * @param {DiscordMessage} message The incoming message.
 * @param {Member} localMember The local member.
 * @return {Promise<void>} A Promise.
 * @private
 */
router._sendOnboardingHelp = async (message, localMember) => {
  switch (localMember.onboarding_state) {
    case 'joined':
      message.channel.send(messages.helpOnboardingState1());
      break;
    case 'first_name':
      message.channel.send(messages.helpOnboardingState2());
      break;
    case 'last_name':
      message.channel.send(messages.helpOnboardingState3());
      break;
    case 'email':
      message.channel.send(messages.helpOnboardingState4());
      break;
    case 'bio':
      message.channel.send(messages.helpOnboardingState5());
      break;
    case 'nickname':
      message.channel.send(messages.helpOnboardingState6());
      break;
    case 'email_verification':
      message.channel.send(messages.helpOnboardingState7());
      break;
    default:
      await message.channel.send(messages.error());
      break;
  }
};
