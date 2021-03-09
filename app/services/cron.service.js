/**
 * @fileoverview Task scheduler using node-cron.
 */

const cron = require('node-cron');

const { followUpJoined1 } = require('../entities/onboarding-followup');

const service = (module.exports = {});

service.init = () => {
  // run every 10 minutes.
  cron.schedule('*/10 * * * *', followUpJoined1);
};
