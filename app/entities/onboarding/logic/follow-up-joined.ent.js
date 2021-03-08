/**
 * @fileoverview Follow up on just joined members and help them get started.
 */

const subDt = require('date-fns/sub');

const { asyncMapCap } = require('../../../utils/helpers');
const { create } = require('../sql/onboard-track.ent');
const { getByStateAndNotOnboardingType } = require('../../members');
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
 * Runs every 10 minutes from the cron.
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
 * Fetches all needed records for the task.
 *
 * @return {Promise<Array<Object>>} An array of member records that have not
 *  gone through the followup_type of this module and also do not have
 *  a record in the moderation table.
 * @private
 */
entity._fetchRecords = async () => {
  const nowDt = new Date();
  const dtFrom = subDt(nowDt, {
    minutes: entity.MIN_MINUTES_TO_FOLLOW_UP,
  });

  const joinedMembers = await getByStateAndNotOnboardingType(
    'joined',
    entity.FOLLOWUP_TYPE,
    dtFrom,
  );

  return joinedMembers;
};

/**
 * Creates record in the onboard_followup record and sends the expected
 * message to the member.
 *
 * @param {Array.<Object>} joinedMembers All the recently joined members.
 * @return {Promise<void>} A Promise.
 * @private
 */
entity._sendFollowUp = async (joinedMembers) => {
  const membersNotified = [];
  const promises = asyncMapCap(joinedMembers, async (localMember) => {
    const guildMember = await getGuildMemberLocal(localMember);
    const createData = {
      discord_uid: localMember.discord_uid,
      followup_type: entity.FOLLOWUP_TYPE,
    };
    await create(createData);
    await guildMember.send(followupJoined1());
    membersNotified.push(`${localMember.discord_uid}:${localMember.username}`);
  });

  await promises;

  await log.info(
    `Sent onboarding followup message of type ${entity.FOLLOWUP_TYPE}.`,
    {
      custom: {
        members: membersNotified.join(', '),
      },
      relay: true,
      emoji: ':wave:',
    },
  );
};
