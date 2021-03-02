/**
 * @fileoverview Step 7, email verification.
 */

const addDt = require('date-fns/add');
const config = require('config');
const { v4: uuid, validate: uuidValidate } = require('uuid');

const { db } = require('../../../services/postgres.service');
const step6 = require('./onboarding-step6-nickname.ent');
const { getGuild, getGuildMember, getRole } = require('../../discord');
const {
  step7Error,
  step7Success,
  step7ResendVerification,
  step7ErrorNoMatch,
  step7ErrorWrongState,
} = require('../messages');
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
    await message.channel.send(step7ErrorNoMatch());
    return;
  }

  // Check if verification token has expired.
  const nowDt = new Date();
  const expireDt = new Date(localMember.verification_code_expires_at);
  if (nowDt > expireDt) {
    await message.channel.send(step7ErrorNoMatch());
    return;
  }

  // Everything checks out, allow the member in.
  await step._enableMember(message, localMember);

  log.info('User verified, joins server', {
    localMember,
    relay: true,
  });
  await message.channel.send(step7Success(msg));
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
  await step._enableMemberDiscord(message);

  await step._enableMemberUpdateRecord(localMember);
};

/**
 * Add discord roles to member.
 *
 * @param {DiscordMessage} message The incoming message.
 * @return {Promise<void>} A Promise.
 * @private
 */
step._enableMemberDiscord = async (message) => {
  const guild = await getGuild(message);
  const guildMember = await getGuildMember(message);

  const allPromises = [];
  config.discord.roles_for_new_member.forEach((roleName) => {
    const role = getRole(guild, roleName);

    allPromises.push(guildMember.roles.add(role));
  });

  return Promise.all(allPromises);
};

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
