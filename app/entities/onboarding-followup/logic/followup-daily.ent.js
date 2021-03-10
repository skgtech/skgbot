/**
 * @fileoverview Follow up on just joined members and help them get started.
 */

const config = require('config');
const differenceInCalendarDays = require('date-fns/differenceInCalendarDays');

const { asyncMapCap } = require('../../../utils/helpers');
const { getStaleOnboardingUsers } = require('../../members');
const { getGuildMemberLocal } = require('../../discord');
const {
  followUpDailyJoined,
  followUpDaily,
  followUpDailyVerify,
  endOfOnboarding,
  lastDayWarning,
} = require('../messages');

const log = require('../../../services/log.service').get();

const entity = (module.exports = {});

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

    await entity._sendDailyFollowUp(joinedMembers);
  } catch (ex) {
    log.error('followUpDaily run() Error', { error: ex });
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

/**
 * Sends appropriate follow up message on members.
 *
 * @param {Array.<Object>} joinedMembers All the recently joined members.
 * @return {Promise<void>} A Promise.
 * @private
 */
entity._sendDailyFollowUp = async (joinedMembers) => {
  const membersNotified = [];
  const membersMissing = [];
  const membersRemoved = [];
  const promises = asyncMapCap(joinedMembers, async (localMemberExt) => {
    const guildMember = await getGuildMemberLocal(localMemberExt);

    // check if member is in the guild
    if (!guildMember) {
      membersMissing.push(
        `${localMemberExt.discord_uid}:${localMemberExt.username}`,
      );
      return;
    }

    const expDays = entity._getExpirationDays;
    const { daysDiff, maxDays } = expDays;
    const message = entity._getProperMessage(localMemberExt, expDays);

    await guildMember.send(message);

    if (daysDiff >= maxDays) {
      membersRemoved.push(localMemberExt);
      try {
        await guildMember.kick('Exceeded maximum onboarding time');
      } catch (ex) {
        log.warn('_sendDailyFollowUp() Could not kick member.', {
          localMember: localMemberExt,
          error: ex,
        });
      }
    }

    membersNotified.push(
      `${localMemberExt.discord_uid}:${localMemberExt.username}`,
    );
  });

  await promises;

  await log.info(`Sent onboarding daily followup message.`, {
    custom: {
      members: membersNotified.join(', '),
      members_missing: membersMissing.join(', '),
      members_removed: membersRemoved.join(', '),
    },
    relay: true,
    emoji: ':wave:',
  });
};

/**
 * Determines what is the appropriate message to send to that member based
 * on their onboarding state and days since they received the "joined1" followup.
 *
 * @param {Member} localMemberExt Extended local member with onboarding_track.
 * @param {Object} expDays Calculated days since followup Joined1.
 * @return {string} Appropriate follow up message to send to the member.
 * @private
 */
entity._getProperMessage = (localMemberExt, expDays) => {
  const { username } = localMemberExt;
  const { daysDiff, maxDays } = expDays;
  if (daysDiff >= maxDays) {
    return endOfOnboarding(username);
  }

  let message = '';
  switch (localMemberExt.onboarding_state) {
    case 'joined':
      message += followUpDailyJoined(username, daysDiff);
      break;
    case 'first_name':
      message += followUpDaily(username, daysDiff, 'First Name');
      break;
    case 'last_name':
      message += followUpDaily(username, daysDiff, 'Last Name');
      break;
    case 'email':
      message += followUpDaily(username, daysDiff, 'Email');
      break;
    case 'bio':
      message += followUpDaily(username, daysDiff, 'Bio');
      break;
    case 'nickname':
      message += followUpDaily(username, daysDiff, 'Nickname');
      break;
    case 'email_verification':
      message += followUpDailyVerify(username, daysDiff, localMemberExt.email);
      break;
    default:
      log.warn('_getProperMessage() :: Bogus onboarding state.', {
        localMember: localMemberExt,
      });
      break;
  }

  // warn member if this is their last day before onboarding expires.
  if (maxDays - daysDiff === 1) {
    message += lastDayWarning();
  }

  return message;
};

/**
 * Calculates days since followup Joined1.
 *
 * @param {Member} localMemberExt Extended member record.
 * @return {Object} "daysDiff" for how many days since followup Joined1.
 *    "maxDays" for the maximum onboarding days.
 * @private
 */
entity._getExpirationDays = (localMemberExt) => {
  const nowDt = new Date();
  const followUpDt = new Date(localMemberExt.created_at_onboard);

  const daysDiff = differenceInCalendarDays(nowDt, followUpDt);
  const maxDays = config.onboarding.max_onboarding_days;

  return {
    daysDiff,
    maxDays,
  };
};
