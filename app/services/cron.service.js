/**
 * @fileoverview Task scheduler using node-cron.
 */

const cron = require('node-cron');

const log = require('./log.service').get();

const {
  followUpJoined1,
  followUpDaily,
} = require('../entities/onboarding-followup');

const service = (module.exports = {});

/**
 * Intialize the task manager (Cron) service.
 *
 * @return {Promise<void>} A Promise.
 */
service.init = async () => {
  await log.info('Initializing CRON Service...');
  // Run every 10 minutes.
  cron.schedule('*/10 * * * *', followUpJoined1);

  // Run at 10am each day.
  cron.schedule('0 10 * * *', followUpDaily);
};
