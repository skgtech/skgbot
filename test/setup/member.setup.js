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
  create: createOnboardTrack,
} = require('../../app/entities/onboarding-followup/sql/onboard-track.sql');

const {
  create: createModeration,
} = require('../../app/entities/moderation/sql/moderation.sql');

const setup = (module.exports = {});

/**
 * Create a member record.
 *
 * @param {Object=} options Options:
 * @param {string=} options.memberType Default is "full" for fully joined,
 *    use "new" for new member that just joined.
 * @param {string=} options.onboardingState Define a custom onboarding state.
 * @param {Date=} options.joinedAt Define value for the "joined_at" column.
 * @param {string=} options.followUpType Creates an "onboard_track" record with
 *    the defined followup_type.
 * @param {Date=} options.followUpCreatedAt Define a custom value on the
 *    onboarding-track table, requires that options.followUpType is defined.
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

  const localMember = await memberSql.getById(memberData.discord_uid);

  await setup._createSecondaryRecords(options, localMember);

  return localMember;
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
 * Create secondary records (in other tables than "members") as defined in options.
 *
 * @param {Object} options See "setup.create()".
 * @param {Member} localMember The created local member.
 * @return {Promise}
 * @private
 */
setup._createSecondaryRecords = async (options, localMember) => {
  if (options.followUpType) {
    const followUpData = {
      discord_uid: localMember.discord_uid,
      followup_type: options.followUpType,
    };
    if (options.followUpCreatedAt) {
      followUpData.created_at = options.followUpCreatedAt;
    }

    await createOnboardTrack(followUpData);
  }

  if (options.moderationCategory) {
    const modUid = process.env.DISCORD_COMMANDO_UID;
    const modData = {
      discord_uid: localMember.discord_uid,
      category: options.moderationCategory,
      moderator_discord_uid: modUid,
      reason: '',
    };

    await createModeration(modData);
  }
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
