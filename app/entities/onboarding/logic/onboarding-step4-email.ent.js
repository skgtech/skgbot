/**
 * @fileoverview Step 4, expect email.
 */

const validator = require('validator');

const { step4Error, step4Success } = require('../messages');
const { update } = require('../../members/members.ent');

const step = (module.exports = {});

/**
 * Step 4, expect email.
 *
 * @param {DiscordMessage} message The incoming message.
 * @param {Member} localMember The fetched local member.
 * @return {Promise<void>}
 */
step.handle4 = async (message, localMember) => {
  const msg = message.content.trim();

  if (validator.isEmail(msg)) {
    message.channel.send(step4Error());
    return;
  }

  if (msg.length > 60) {
    message.channel.send(step4Error());
    return;
  }

  await update(localMember.discord_uid, {
    email: msg,
    onboarding_state: 'bio',
  });

  message.channel.send(step4Success(msg));
};
