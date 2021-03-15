/**
 * @fileoverview Bootsrap for Entities.
 */

const discordEnt = require('./discord');
const onboarding = require('./onboarding');
const messageRouter = require('./message-router');

const bootstrap = (module.exports = {});

/**
 * Bootstrap for Entities.
 */
bootstrap.init = async () => {
  messageRouter.init();
  onboarding.init();
  discordEnt.init();
};
