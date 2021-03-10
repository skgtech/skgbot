/**
 * @fileoverview Follow up on just joined members and help them get started.
 */

const subDt = require('date-fns/sub');

const { asyncMapCap } = require('../../../utils/helpers');
const { create } = require('../sql/onboard-track.sql');
const { getStaleOnboardingUsers } = require('../../members');
const { getGuildMemberLocal } = require('../../discord');
const { followupJoined1 } = require('../messages');

const log = require('../../../services/log.service').get();

const entity = (module.exports = {});

/**
 * @const {number} MIN_MINUTES_TO_FOLLOW_UP How many minutes must have passed
 *   before a followup message is sent.
 */
entity.MIN_MINUTES_TO_FOLLOW_UP = 5;

/**
 * @const {string} FOLLOWUP_TYPE The distinct followup type for this operation.
 */
entity.FOLLOWUP_TYPE = 'joined1';

/**
 * Will send another message to nudge members that have just joined the server
 * and have not yet started the onboarding process.
 *
 * Runs daily from the task manager (cron).
 *
 * @return {Promise} A Promise, errors are not handled, handle them inline.
 */
entity.run = async () => {
  try {
    const joinedMembers = await entity._fetchRecords();

    if (joinedMembers.length === 0) {
      return;
    }

    await entity._sendFollowUp(joinedMembers);
  } catch (ex) {
    log.error('followUpJoined run() Error', { error: ex });
  }
};

/**
 * Fetches and filters all needed records for the task.
 *
 * @return {Promise<Array<Object>>} An array of member records that have not
 *  gone through the followup_type of this module and also do not have
 *  a record in the moderation table.
 * @private
 */
entity._fetchRecords = async () => {
  const joinedMembers = await getStaleOnboardingUsers();

  // Filter out members that have been follow'ed up already with the
  // "joined1" first followup, within the same day.
  const nowDt = new Date();
  const nowDayOfMonth = nowDt.getDate();

  const filterJoined = joinedMembers.filter((localMemberExt) => {
    const followUpDt = new Date(localMemberExt.created_at_onboard);
    const dayOfMonth = followUpDt.getDate();

    return dayOfMonth !== nowDayOfMonth;
  });

  return filterJoined;
};
