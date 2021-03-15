/**
 * @fileoverview Business logic responsible for member verification.
 */

const { validate: uuidValidate, v4: uuid } = require('uuid');

const { canOnboard } = require('../../moderation');
const { db } = require('../../../services/postgres.service');
const discordHelpers = require('../../discord');
const { update: updateMember } = require('../../members');
const log = require('../../../services/log.service').get();

const entity = (module.exports = {});

/**
 * Business logic on how to create a verification token.
 *
 * @param {Member} localMember The local member to issue a new verification
 *    token for.
 * @return {string}
 */
entity.getVerificationToken = (localMember) => {
  return `${localMember.discord_uid}_${uuid()}`;
};

/**
 * Validates the given token against the provided local member.
 *
 * @param {Member} localMember The fetched local member.
 * @param {string} token The token to validate.
 * @return {boolean} If it passes validation.
 */
entity.verifyMemberToken = async (localMember, token) => {
  const [memberId, uuidToken] = token.split('_');

  if (memberId !== localMember.discord_uid) {
    await log.warn('Bogus member id provided for token verification', {
      localMember,
      custom: {
        member_id_provided: memberId,
      },
    });
    return false;
  }

  if (!uuidValidate(uuidToken)) {
    return false;
  }

  // Check if verification token matches the one on record.
  if (uuidToken !== localMember.verification_code) {
    return false;
  }

  // Check if verification token has expired.
  const nowDt = new Date();
  const expireDt = new Date(localMember.verification_code_expires_at);
  if (nowDt > expireDt) {
    return false;
  }

  return true;
};

/**
 * Checks if the onboarding member can join the discord server.
 *
 * @param {Member} localMember The local member that wants to onboard.
 * @return {Promise<boolean>} A Promise with the determination.
 */
entity.canOnboard = async (localMember) => {
  return canOnboard(localMember);
};

/**
 * The final step of onboarding, enabling the member to join the discord server.
 *
 * This function will update the member's record and add the necessary roles.
 *
 * @param {DiscordGuildMember} guildMember The incoming message.
 * @param {Member} localMember The local member record.
 * @return {Promise<void>} A Promise.
 * @private
 */
entity.enableMember = async (guildMember, localMember) => {
  await discordHelpers.applyRolesToNewMember(guildMember);

  // Update DB record for this member.
  const updateData = {
    onboarding_state: 'member',
    is_onboarded: true,
    onboarded_at: db().fn.now(),
  };
  await updateMember(localMember.discord_uid, updateData);
};