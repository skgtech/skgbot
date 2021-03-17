/**
 * @fileoverview Step 7, email verification via bot private message.
 */

const { cannotOnboard, step7Error, step7Success } = require('../messages');
const discordHelpers = require('../../discord');
const {
  verifyMemberToken,
  enableMember,
  canOnboard,
} = require('./verification.ent');
const log = require('../../../services/log.service').get();

const step = (module.exports = {});

/**
 * Step 7, email verification, member pastes the verification token.
 *
 * @param {DiscordMessage} message The incoming message.
 * @param {Member} localMember The fetched local member.
 * @return {Promise<void>}
 */
step.handle7 = async (message, localMember) => {
  const token = message.content.trim();

  // Token verifications and validations.
  const verified = await verifyMemberToken(localMember, token);
  if (!verified) {
    await message.channel.send(step7Error());
    return;
  }

  // Check moderation or any other restrictions
  const memberCanOnboard = await canOnboard(localMember);
  if (!memberCanOnboard) {
    await message.channel.send(cannotOnboard());
    return;
  }

  // Everything checks out, allow the member in.
  const guildMember = await discordHelpers.getGuildMember(message);
  await enableMember(guildMember, localMember);

  await log.info('User verified via bot, joins server', {
    localMember,
    relay: true,
    emoji: ':ballot_box_with_check: :robot:',
  });

  await message.channel.send(step7Success());
};
