/**
 * @fileoverview Task scheduler using node-cron.
 */

const cron = require('node-cron');

const {
  followUpJoined1,
  followUpDaily,
} = require('../entities/onboarding-followup');

const service = (module.exports = {});

service.init = () => {
  // Run every 10 minutes.
  cron.schedule('*/10 * * * *', followUpJoined1);

  // Run at 10am each day.
  cron.schedule('0 10 * * *', followUpDaily);
};
