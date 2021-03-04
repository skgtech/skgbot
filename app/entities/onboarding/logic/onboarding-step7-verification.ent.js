/**
 * @fileoverview Step 7, email verification.
 */

const addDt = require('date-fns/add');
const config = require('config');
const { v4: uuid } = require('uuid');

const step6 = require('./onboarding-step6-nickname.ent');
const { getGuildMember, applyRoles } = require('../../discord');
const {
  step7Error,
  step7Success,
  step7ResendVerification,
  step7ErrorWrongState,
} = require('../messages');
const {
  update,
  verifyMemberToken,
  enableMember,
} = require('../../members/members.ent');
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
  const token = message.content.trim();

  const verified = verifyMemberToken(localMember, token);
  if (!verified) {
    await message.channel.send(step7Error());
    return;
  }

  // Everything checks out, allow the member in.
  await step._enableMember(message, localMember);

  log.info('User verified via bot, joins server', {
    localMember,
    relay: true,
    emoji: ':plusone: :robot:',
  });
  await message.channel.send(step7Success());
};

/**
 * Will resend the verification email, if needed it will reset the token
 * and update the expiration date.
 *
 * @param {DiscordMessage} message The incoming message.
 * @param {Member} localMember The local member record.
 * @return {Promise<void>} A Promise.
 */
step.resendVerification = async (message, localMember) => {
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
 * @param {DiscordMessage} message The incoming message.
 * @param {Member} localMember The local member record.
 * @return {Promise<void>} A Promise.
 * @private
 */
step._enableMember = async (message, localMember) => {
  const guildMember = await getGuildMember(message);
  await applyRoles(guildMember);

  await enableMember(localMember);
};
