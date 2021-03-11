/**
 * @fileoverview Task scheduler using node-cron.
 */

const cron = require('node-cron');

const log = require('./log.service').get();

const {
  followUpJoined1,
  followUpDaily,
  checkMissing,
} = require('../entities/onboarding-followup');

const service = (module.exports = {});

/**
 * Intialize the task manager (Cron) service.
 *
 * @return {Promise<void>} A Promise.
 */
service.init = async () => {
  await log.info('Initializing CRON Service...');
  // Run every 10 minutes. Check just joined members and followup.
  service._taskFollowUpJoined1 = cron.schedule('*/10 * * * *', followUpJoined1);

  // Run every 10 minutes. Check for joined members that the bot missed and add them.
  service._taskCheckMissing = cron.schedule('*/10 * * * *', checkMissing);

  // Run at 10am each day.
  service._taskFollowUpDaily = cron.schedule('0 10 * * *', followUpDaily);
};

/**
 * Destroy all instances of cron.
 *
 * @return {Promise<void>} A promise.
 */
service.dispose = async () => {
  service._taskFollowUpJoined1.destroy();
  service.service._taskCheckMissing.destroy();
  service._taskFollowUpDaily.destroy();
};
