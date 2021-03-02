/**
 * @fileoverview Step 2, expect first name.
 */

const { isName } = require('../../../utils/validators');
const { update } = require('../../members/members.ent');
const { step2Error, step2Success } = require('../messages');

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

  if (!isName(msg)) {
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
