/**
 * @fileoverview Business logic responsible for resending the verification email.
 */

const addDt = require('date-fns/add');
const config = require('config');

const { update: updateMember } = require('../../members');
const { getVerificationToken } = require('./verification.ent');
const {
  step7ErrorWrongState,
  step7ResendVerification,
} = require('../messages');
const { sendVerificationEmail } = require('./onboarding-step6-nickname.ent');
const log = require('../../../services/log.service').get();

const entity = (module.exports = {});

/**
 * Will resend the verification email, if needed it will reset the token
 * and update the expiration date.
 *
 * @param {DiscordMessage} message The incoming message.
 * @param {Member} localMember The local member record.
 * @return {Promise<void>} A Promise.
 */
entity.resendVerification = async (message, localMember) => {
  if (localMember.onboarding_state !== 'email_verification') {
    await message.channel.send(step7ErrorWrongState());
    return;
  }

  await log.info('Resend Verification requested.', {
    localMember,
    relay: true,
    emoji: ':envelope_with_arrow: :arrows_counterclockwise:',
  });

  const nowDt = new Date();
  const expireDt = new Date(localMember.verification_code_expires_at);

  let verificationCode = localMember.verification_code;
  if (nowDt > expireDt) {
    // Verification Expired, issue a new one.
    verificationCode = await entity._resetVerification(localMember);
  }

  await message.channel.send(step7ResendVerification(localMember.email));

  // Prepare and dispatch the verification email
  await sendVerificationEmail(localMember, verificationCode);
};

/**
 * Resets the verification token and expiration date of the member.
 *
 * @param {Member} localMember The local member record.
 * @return {Promise<string>} A promise with the new verification token.
 * @private
 */
entity._resetVerification = async (localMember) => {
  const verification_code = getVerificationToken(localMember);
  const nowDt = new Date();
  const verification_code_expires_at = addDt(nowDt, {
    days: config.onboarding.verification_expires_days,
  });
  await updateMember(localMember.discord_uid, {
    verification_code,
    verification_code_expires_at,
  });

  return verification_code;
};
