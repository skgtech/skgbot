/**
 * @fileoverview Step 6, expect nickname.
 */

const validator = require('validator');

const { step6Error, step6Success } = require('../messages');
const { update } = require('../../members/members.ent');

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

  await update(localMember.discord_uid, {
    nickname: msg,
    onboarding_state: 'email_verification',
  });

  message.channel.send(step6Success(msg));
};
