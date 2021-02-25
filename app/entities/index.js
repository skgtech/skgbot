/**
 * @fileoverview Bootsrap for Entities.
 */

const onboarding = require('./onboarding');

const bootstrap = (module.exports = {});

/**
 * Bootstrap for Entities.
 */
bootstrap.init = async () => {
  onboarding.init();
};
