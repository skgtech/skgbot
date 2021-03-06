/**
 * @fileoverview Follow up on just joined members and help them get started.
 */

const subDt = require('date-fns/sub');

const { getJoinedMembersByDt } = require('../../members');

const entity = (module.exports = {});

/**
 * Will send another message to nudge members that have just joined the server
 * and have not yet started the onboarding process.
 *
 * Runs every 10 minutes from the cron.
 *
 * @return {Promise} A Promise, errors are not handled, handle them inline.
 */
entity.run = async () => {
  const nowDt = new Date();
  const dtFrom = subDt(nowDt, {
    minutes: 10,
  });

  const joinedMembers = await getJoinedMembersByDt(dtFrom);
};
