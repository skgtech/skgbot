/**
 * SKGBot
 * Discord greeting and registering bot.
 * https://github.com/skgtech/skgbot
 *
 * Copyright © SKGTech
 * ISC License (ISC).
 */

/**
 * @fileoverview Master bootstrap module.
 */

const fs = require('fs');

const __ = require('lodash');

require('./utils/jsdoc-type-definitions');
const globals = require('./utils/globals');
const logService = require('./services/logging/log.service');
//
// WARNING
// do not include any more libraries before the log service is initialized.
//
//

/**
 * @fileoverview Master bootsrap module.
 *
 */

const Discord = require('discord.js');

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', (msg) => {
  if (msg.content === 'ping') {
    msg.channel.send('pong');
  }
});

client.login('token');

/**
 * The master boot.
 *
 */
const app = (module.exports = {});

// define stand alone status
globals.isStandAlone = require.main === module;

let initialized = false;
let appServices;

/**
 * Master bootstrap module.
 *
 * Available options to pass on the first arg:
 *
 * @param {Object=} optOpts init params.
 * @param {boolean} optOpts.webserver Launch webserver, default true.
 * @param {string=} optOpts.appName Set a custom appname for the logger.
 * @param {boolean=} optOpts.suppressLogging Do not log to stdout.
 * @return {Promise} A Promise.
 */
app.init = async (optOpts) => {
  if (initialized) {
    return;
  }
  initialized = true;

  // Get user & default boot options.
  const bootOpts = app._getBootOpts(optOpts);

  // if run as root, downgrade to the owner of this file
  app._checkRoot();

  // Initialize logging service
  logService.init(bootOpts);

  const log = logService.get();

  log.notice(
    `Srop Core Initializing. standAlone: ${globals.isStandAlone}` +
      ` :: System NODE_ENV: ${process.env.NODE_ENV} :: App Environment:` +
      ` ${globals.env}`,
    {
      custom: {
        stand_alone: globals.isStandAlone,
        env_process: process.env.NODE_ENV,
        env_application: globals.env,
      },
    },
  );

  app._setupErrorHandlers(log);

  appServices = require('./app-services');

  try {
    await appServices.boot(bootOpts);
  } catch (ex) {
    log.emergency('Error on boot:', { error: ex });
    throw ex;
  }
};

/**
 * Catch-all for App exit
 *
 * @param {Object} options Options as passed from listeners.
 * @param {string} options.type Reason for shutdown.
 * @param {boolean} options.exit If process.exit() should be called.
 * @param {number} options.exitCode Exitcode to return.
 * @param {Error=} error An error object.
 * @return {Promise<void>}
 */
app.handleNodeExit = async ({ exit = true, exitCode = 0, type }, error) => {
  const log = logService.get();
  log.notice('Received exit code', {
    custom: { type },
  });

  if (error instanceof Error) {
    log.alert('Node app exits with error', { error });
  }

  await app.dispose();

  if (exit) {
    process.exit(exitCode);
  }
};

/**
 * Local expose method.
 */
app.dispose = async () => {
  await appServices.dispose();
};

/**
 * Setup global error handlers.
 *
 * @param {Object} log Logger.
 * @private
 */
app._setupErrorHandlers = function (log) {
  process.on(
    'SIGINT',
    app.handleNodeExit.bind(null, {
      type: 'SIGINT',
    }),
  );
  process.on(
    'SIGTERM',
    app.handleNodeExit.bind(null, {
      type: 'SIGTERM',
    }),
  );
  process.on(
    'uncaughtException',
    app.handleNodeExit.bind(null, {
      type: 'uncaughtException',
      exitCode: 99,
    }),
  );
  process.on('unhandledRejection', (error) => {
    log.critical('Unhandled Promise Rejection', { error });
  });
};

/**
 * Apply the default boot options unless defined in provided options.
 *
 * @param {Object=} optOpts Boot options as defined by user.
 * @return {Object} Defined options with their default or user defined values.
 * @private
 */
app._getBootOpts = (optOpts) => {
  let userOpts = {};
  if (__.isObject(optOpts)) {
    userOpts = optOpts;
  }

  /** @type {Object} define default options */
  const bootOpts = __.defaults(userOpts, {
    // launch webserver
    webserver: true,

    // Suppress logging to console
    suppressLogging: false,

    appName: 'srop-core',
  });

  return bootOpts;
};

/**
 * if run as root, downgrade to the owner of this file
 *
 * @private
 */
app._checkRoot = () => {
  if (process.getuid() === 0) {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    fs.stat(__filename, function (err, stats) {
      if (err) {
        // eslint-disable-next-line no-console
        return console.error('Failed to downgrade from root. Error:', err);
      }
      process.setuid(stats.uid);
    });
  }
};

// ignition
if (globals.isStandAlone) {
  app.init();
}
