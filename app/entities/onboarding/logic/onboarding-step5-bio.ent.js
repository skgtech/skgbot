/**
 * @fileoverview Step 5, expect bio.
 */
const { step5Error, step5Success } = require('../messages');
const { update, validateBio } = require('../../members/members.ent');

const step = (module.exports = {});

/**
 * Step 5, expect bio.
 *
 * @param {DiscordMessage} message The incoming message.
 * @param {Member} localMember The fetched local member.
 * @return {Promise<void>}
 */
step.handle5 = async (message, localMember) => {
  const msg = message.content.trim();

  if (!validateBio(msg)) {
    message.channel.send(step5Error());
    return;
  }

  await update(localMember.discord_uid, {
    bio: msg,
    onboarding_state: 'nickname',
  });

  message.channel.send(step5Success(msg));
};
