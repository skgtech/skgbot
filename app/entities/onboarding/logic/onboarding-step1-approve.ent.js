/**
 * @fileoverview Step 1, expect a "yes" from the member to start onboarding.
 */

const { step1Error, step1Success } = require('../messages');
const { update } = require('../../members/members.ent');

const step = (module.exports = {});

/**
 * Handles Step 1, expect a "yes" to start the onboarding.
 *
 * @param {DiscordMessage} message The incoming message.
 * @param {Member} localMember The fetched local member.
 * @return {Promise<void>}
 */
step.handle1 = async (message, localMember) => {
  const msg = message.content.toLowerCase().trim();

  if (msg !== 'yes') {
    message.channel.send(step1Error());
    return;
  }

  await update(localMember.discord_uid, {
    onboarding_state: 'first_name',
  });

  message.channel.send(step1Success());
};
