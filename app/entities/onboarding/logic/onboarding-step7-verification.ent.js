/**
 * @fileoverview Step 7, email verification.
 */

const { validate: uuidValidate } = require('uuid');

const { db } = require('../../../services/postgres.service');
const emailService = require('../../../services/email.service');
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
 * Enable the member to use the discord server, add roles and update record.
 *
 * @param {Member} localMember The local member record.
 * @return {Promise<void>} A Promise.
 * @private
 */
step._enableMember = async (localMember) => {
  await step._enableMemberDiscord(localMember);

  const updateData = {
    onboarding_state: 'member',
    is_onboarded: true,
    onboarded_at: db().fn.now(),
  };
  await update(localMember.discord_uid, updateData);
};

step._enableMemberDiscord = async (localMember) => {};
