/**
 * @fileoverview Business logic responsible for member verification.
 */

const { validate: uuidValidate } = require('uuid');

const { canOnboard } = require('../../moderation');
const { getGuildMemberLocal, applyRoles } = require('../../discord');
const { getById } = require('../sql/members.sql');
const { enableMember } = require('./enable-member.ent');
const { render } = require('../templates/verify-member.tpl');
const { step7Success, cannotOnboard } = require('../../onboarding/messages');
const log = require('../../../services/log.service').get();

const entity = (module.exports = {});

/**
 * Validates the given token against the provided local member.
 *
 * @param {Member} localMember The fetched local member.
 * @param {string} token The token to validate.
 * @return {boolean} If it passes validation.
 */
entity.verifyMemberToken = async (localMember, token) => {
  const [memberId, uuidToken] = token.split('_');

  if (memberId !== localMember.discord_uid) {
    await log.warn('Bogus member id provided for token verification', {
      localMember,
      custom: {
        member_id_provided: memberId,
      },
    });
    return false;
  }

  if (!uuidValidate(uuidToken)) {
    return false;
  }

  // Check if verification token matches the one on record.
  if (uuidToken !== localMember.verification_code) {
    return false;
  }

  // Check if verification token has expired.
  const nowDt = new Date();
  const expireDt = new Date(localMember.verification_code_expires_at);
  if (nowDt > expireDt) {
    return false;
  }

  return true;
};

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
    verificationCode = await step._resetVerification(localMember);
  }

  await message.channel.send(step7ResendVerification(localMember.email));

  // Prepare and dispatch the verification email
  await step6.sendVerificationEmail(localMember, verificationCode);
};
