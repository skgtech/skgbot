/**
 * @fileoverview Step 6, expect nickname.
 */

const addDt = require('date-fns/add');
const config = require('config');
const validator = require('validator');
const { v4: uuid } = require('uuid');

const emailService = require('../../../services/email.service');
const {
  step6Error,
  step6Success,
  onboardingSubject,
  onboardingEmail,
} = require('../messages');
const { update } = require('../../members/members.ent');
const log = require('../../../services/log.service').get();

const step = (module.exports = {});

/**
 * Step 6, expect nickname.
 *
 * @param {DiscordMessage} message The incoming message.
 * @param {Member} localMember The fetched local member.
 * @return {Promise<void>}
 */
step.handle6 = async (message, localMember) => {
  const msg = message.content.trim();

  const seed = '-abcdefghijklmnopqrstuvwxyz';
  if (validator.contains(msg, seed)) {
    message.channel.send(step6Error());
    return;
  }

  if (msg.length > 32) {
    message.channel.send(step6Error());
    return;
  }

  // Update the database with the new state and verfication code
  const verification_code = uuid();
  const nowDt = new Date();
  const verification_code_expires_at = addDt(nowDt, {
    days: config.onboarding.verification_expires_days,
  });
  await update(localMember.discord_uid, {
    nickname: msg,
    onboarding_state: 'email_verification',
    verification_code,
    verification_code_expires_at,
  });

  // Prepare and dispatch the verification email
  await step.sendVerificationEmail(localMember, verification_code);

  message.channel.send(step6Success(msg));
};

/**
 * Prepare and send the verification email.
 *
 * @param {Member} localMember Local Member.
 * @param {string} verificationCode The verification code.
 * @return {Promise<Object>} A Promise with the nodemailer response object.
 */
step.sendVerificationEmail = async (localMember, verificationCode) => {
  const emailRes = await emailService.send(
    localMember.email,
    onboardingSubject(),
    onboardingEmail(localMember.first_name, verificationCode),
  );

  log.info('Sent verification email to member', {
    localMember,
    custom: {
      message_id: emailRes.messageId,
    },
  });
};
