/**
 * @fileoverview Step 3, expect last name.
 */

const validator = require('validator');

const { step3Error, step3Success } = require('../messages');
const { update } = require('../../members/members.ent');

const step = (module.exports = {});

/**
 * Step 3, expect last name.
 *
 * @param {DiscordMessage} message The incoming message.
 * @param {Member} localMember The fetched local member.
 * @return {Promise<void>}
 */
step.handle3 = async (message, localMember) => {
  const msg = message.content.trim();

  const seed = ' -abcdefghijklmnopqrstuvwxyz';
  if (validator.contains(msg, seed)) {
    message.channel.send(step3Error());
    return;
  }

  if (msg.length > 30) {
    message.channel.send(step3Error());
    return;
  }

  await update(localMember.discord_uid, {
    last_name: msg,
    onboarding_state: 'email',
  });

  message.channel.send(step3Success(msg));
};
