/**
 * @fileoverview Handles onboarding messages.
 */

const log = require('../../services/log.service').get();

const {
  handle1,
  handle2,
  handle3,
  handle4,
  handle5,
  handle6,
  handle7,
} = require('../onboarding');

const router = (module.exports = {});

/**
 * Handles onboarding private messages.
 *
 * @param {DiscordMessage} message Discord Message Object.
 * @param {Member} localMember The local member.
 * @return {Promise<void>} A Promise.
 */
router._onMessage = async (message, localMember) => {
  // Handle the message based on the member's current onboarding state.
  switch (localMember.onboarding_state) {
    case 'joined':
      await handle1(message, localMember);
      break;
    case 'first_name':
      await handle2(message, localMember);
      break;
    case 'last_name':
      await handle3(message, localMember);
      break;
    case 'email':
      await handle4(message, localMember);
      break;
    case 'bio':
      await handle5(message, localMember);
      break;
    case 'nickname':
      await handle6(message, localMember);
      break;
    case 'email_verification':
      await handle7(message, localMember);
      break;
    default:
      log.error(
        `Bogus member "onboarding_state": ${localMember.onboarding_state}`,
        {
          custom: {
            onboarding_state: localMember.onboarding_state,
          },
        },
      );
      break;
  }
};
