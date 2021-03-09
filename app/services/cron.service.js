/**
 * @fileoverview Task scheduler using node-cron.
 */

const cron = require('node-cron');

const { followUpJoined } = require('../entities/onboarding');

const service = (module.exports = {});

service.init = () => {
  // run every 10 minutes.
  cron.schedule('*/10 * * * *', followUpJoined);
};
