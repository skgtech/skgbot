/**
 * @fileoverview Enables a new member's record after they have validated.
 */

const { db } = require('../../../services/postgres.service');
const { update } = require('../sql/members.sql');

const entity = (module.exports = {});

/**
 * Update the record of the member.
 *
 * @param {Member} localMember The local member record.
 * @return {Promise<void>} A Promise.
 */
entity.enableMember = async (localMember) => {
  const updateData = {
    onboarding_state: 'member',
    is_onboarded: true,
    onboarded_at: db().fn.now(),
  };
  await update(localMember.discord_uid, updateData);
};
