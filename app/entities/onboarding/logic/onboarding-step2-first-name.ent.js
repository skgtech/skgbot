/**
 * @fileoverview Step 2, expect first name.
 */

const validator = require('validator');

const { step2Error, step2Success } = require('../messages');
const { update } = require('../../members/members.ent');

const step = (module.exports = {});

/**
 * Step 2, expect first name.
 *
 * @param {DiscordMessage} message The incoming message.
 * @param {Member} localMember The fetched local member.
 * @return {Promise<void>}
 */
step.handle2 = async (message, localMember) => {
  const msg = message.content.trim();

  const seed = ' -abcdefghijklmnopqrstuvwxyz';
  if (validator.contains(msg, seed)) {
    message.channel.send(step2Error());
    return;
  }

  if (msg.length > 20) {
    message.channel.send(step2Error());
    return;
  }

  await update(localMember.discord_uid, {
    first_name: msg,
    onboarding_state: 'last_name',
  });

  message.channel.send(step2Success(msg));
};
