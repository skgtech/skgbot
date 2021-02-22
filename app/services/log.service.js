/**
 * @fileoverview Initializes the Logality library and provides the .get() method.
 * @see https://github.com/thanpolas/logality
 */

const Logality = require('logality');

/**
 * WARNING
 *
 * Do not require any other modules at this point, before the log service
 * init() method has been invoked.
 *
 * WARNING
 */

const globals = require('../utils/globals');

const logger = (module.exports = {});

logger.logality = null;

/**
 * Initialize the logging service.
 *
 * @param {Object} bootOpts boot options. This module will check for:
 * @param {string=} bootOpts.appName Set a custom appname for the logger.
 * @param {boolean=} bootOpts.suppressLogging Do not log to stdout.
 */
logger.init = function (bootOpts = {}) {
  // check if already initialized.
  if (logger.logality) {
    return;
  }

  const appName = bootOpts.appName || 'skgbot';

  const serializers = {};

  logger.logality = new Logality({
    prettyPrint: globals.isLocal || globals.isTest,
    appName,
    async: true,
    serializers,
  });

  // Create the get method
  logger.get = logger.logality.get.bind(logger.logality);
};
