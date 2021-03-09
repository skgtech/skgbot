/**
 * @fileoverview Setup cases for members.
 */

const { asyncMapCap } = require('../../app/utils/helpers');
const { db } = require('../../app/services/postgres.service');
const memberFix = require('../fixtures/members.fix');
const memberSql = require('../../app/entities/members/sql/members.sql');
const {
  getByMemberIds: getModsByMemberIds,
} = require('../../app/entities/moderation/sql/moderation.sql');
const {
  getByMemberIds: getOnboardByMemberIds,
} = require('../../app/entities/onboarding/sql/onboard-track.ent');

const setup = (module.exports = {});

/**
 * Create a member record.
 *
 * @param {Object} options Options:
 * @param {string} options.memberType Default is "full" for fully joined,
 *    use "new" for new member that just joined.
 * @param {string} options.onboardingState Define a custom onboarding state.
 * @param {Date} options.joinedAt Define value for the "joined_at" column.
 * @return {Promise<Object>} The User record.
 */
setup.create = async (options = {}) => {
  let memberData = {};

  if (options.memberType === 'new') {
    memberData = memberFix.memberNew();
  } else {
    memberData = memberFix.memberFull();
  }

  if (options.joinedAt) {
    memberData.joined_at = options.joinedAt;
  }

  if (options.onboardingState) {
    memberData.onboarding_state = options.onboardingState;
  }

  await memberSql.create(memberData);

  const memberRecord = memberSql.getById(memberData.discord_uid);

  return memberRecord;
};

/**
 * Creates as many members as there are option objects defined in the
 * options argument.
 *
 * @param {Array<Object>} [options=[{}]] Array of options to create members with.
 * @return {Promise<Array<Object>>} A Promise with an array of the created
 *    members.
 */
setup.createMulty = async (options = [{}]) => {
  const allMembers = await asyncMapCap(options, (memberOpts) =>
    setup.create(memberOpts),
  );

  return allMembers;
};

/**
 * Deletes a member and along with everything related to them.
 *
 * @param {!Member} member The user object to be deleted.
 * @return {Promise<void>}
 */
setup.delete = async (member) => {
  if (!member.discord_uid) {
    throw new Error('Argument "member.discord_uid" is required');
  }

  return setup.deleteMulti([member]);
};

/**
 * Delete multiple members. Physically catastrofic fucntion, deletes
 * and all related records.
 *
 * @param {Array.<Object>} members Members in an array.
 * @return {Promise} A Promise.
 */
setup.deleteMulti = async (members) => {
  // collect all member ids.
  const memberIds = members.map((member) => member.discord_uid);

  const relatedRecords = await setup.getRelatedRecords(memberIds);

  await db()
    .table('moderation')
    .whereIn('id', relatedRecords.moderationIds)
    .del();

  await db()
    .table('onboard_track')
    .whereIn('id', relatedRecords.onboardingIds)
    .del();

  await db().table('members').whereIn('discord_uid', memberIds).del();
};

/**
 * Query for all the related records for the given members and return the
 * related records ids.
 *
 * @param {Array.<string>} memberIds Array with member discord ids.
 * @return {Promise.<Object>} A custom object with the models and id's that
 *   are related to the provided members. This is in flat form, not per member.
 */
setup.getRelatedRecords = async (memberIds) => {
  const moderations = await getModsByMemberIds(memberIds);
  const onboardings = await getOnboardByMemberIds(memberIds);

  const moderationIds = moderations.map((moderation) => moderation.id);
  const onboardingIds = onboardings.map((onboard) => onboard.id);

  return {
    moderationIds,
    onboardingIds,
  };
};
