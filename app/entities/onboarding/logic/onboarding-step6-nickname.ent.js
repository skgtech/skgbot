/**
 * @fileoverview Step 6, expect nickname.
 */

const addDt = require('date-fns/add');
const config = require('config');
const { v4: uuid } = require('uuid');

const emailService = require('../../../services/email.service');
const {
  step6Error,
  step6Error2,
  step6Success,
  onboardingSubject,
  onboardingEmail,
} = require('../messages');
const { setNickname } = require('../../discord');
const { update } = require('../../members/members.ent');
const { validateNickname } = require('../../../utils/validators');
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

  // Validate nickname
  if (!validateNickname(msg)) {
    message.channel.send(step6Error());
    return;
  }
  try {
    // Update the database with the new state and verfication code
    const verification_code = `${localMember.discord_uid}_${uuid()}`;
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

    // Set the nickname on the discord server
    await setNickname(message, localMember, msg);
    await message.channel.send(step6Success(msg));

    // Prepare and dispatch the verification email
    await step.sendVerificationEmail(localMember, verification_code);
  } catch (ex) {
    message.channel.send(step6Error2());
  }
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

  await log.info(
    'Nickname set on onboarding member and email verification sent',
    {
      localMember,
      custom: {
        message_id: emailRes.messageId,
      },
      emoji: ':envelope_with_arrow:',
      relay: true,
    },
  );
};
