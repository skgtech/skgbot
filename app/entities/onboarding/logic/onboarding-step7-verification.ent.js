/**
 * @fileoverview Step 7, email verification.
 */

const addDt = require('date-fns/add');
const config = require('config');
const { v4: uuid, validate: uuidValidate } = require('uuid');

const { db } = require('../../../services/postgres.service');
const step6 = require('./onboarding-step6-nickname.ent');
const { step7Error, step7Success, step7ErrorNoMatch } = require('../messages');
const { update } = require('../../members/members.ent');
const log = require('../../../services/log.service').get();

const step = (module.exports = {});

/**
 * Step 7, email verification.
 *
 * @param {DiscordMessage} message The incoming message.
 * @param {Member} localMember The fetched local member.
 * @return {Promise<void>}
 */
step.handle7 = async (message, localMember) => {
  const msg = message.content.trim();

  if (!uuidValidate(msg)) {
    message.channel.send(step7Error());
    return;
  }

  // Check if verification token matches the one on record.
  if (msg !== localMember.verification_code) {
    message.channel.send(step7ErrorNoMatch());
    return;
  }

  // Check if verification token has expired.
  const nowDt = new Date();
  const expireDt = new Date(localMember.verification_code_expires_at);
  if (nowDt > expireDt) {
    message.channel.send(step7ErrorNoMatch());
    return;
  }

  // Everything checks out, allow the member in.
  await step._enableMember(localMember);

  log.info('User verified, joins server', {
    localMember,
  });
  message.channel.send(step7Success(msg));
};

/**
 * Will resend the verification email, if needed it will reset the token
 * and update the expiration date.
 *
 * @param {Member} localMember The local member record.
 * @return {Promise<void>} A Promise.
 */
step.resendVerification = async (localMember) => {
  log.info('Resend Verification requested.', localMember);

  const nowDt = new Date();
  const expireDt = new Date(localMember.verification_code_expires_at);

  let verificationCode = localMember.verification_code;
  if (nowDt > expireDt) {
    // Verification Expired, issue a new one.
    verificationCode = await step._resetVerification(localMember);
  }

  // Prepare and dispatch the verification email
  await step6.sendVerificationEmail(localMember, verificationCode);
};

/**
 * Resets the verification token and expiration date of the member.
 *
 * @param {Member} localMember The local member record.
 * @return {Promise<string>} A promise with the new verification token.
 * @private
 */
step._resetVerification = async (localMember) => {
  const verification_code = uuid();
  const nowDt = new Date();
  const verification_code_expires_at = addDt(nowDt, {
    days: config.onboarding.verification_expires_days,
  });
  await update(localMember.discord_uid, {
    onboarding_state: 'email_verification',
    verification_code,
    verification_code_expires_at,
  });

  return verification_code;
};

/**
 * Enable the member to use the discord server, add roles and update record.
 *
 * @param {Member} localMember The local member record.
 * @return {Promise<void>} A Promise.
 * @private
 */
step._enableMember = async (localMember) => {
  await step._enableMemberDiscord(localMember);

  await step._enableMemberUpdateRecord(localMember);
};

/**
 * Add discord roles to member.
 *
 * @param {Member} localMember The local member record.
 * @return {Promise<void>} A Promise.
 * @private
 */
step._enableMemberDiscord = async (localMember) => {};

/**
 * Update the record of the member.
 *
 * @param {Member} localMember The local member record.
 * @return {Promise<void>} A Promise.
 * @private
 */
step._enableMemberUpdateRecord = async (localMember) => {
  const updateData = {
    onboarding_state: 'member',
    is_onboarded: true,
    onboarded_at: db().fn.now(),
  };
  await update(localMember.discord_uid, updateData);
};
