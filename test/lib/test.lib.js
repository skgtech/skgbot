/**
 * @fileoverview Core testing library, must be included by all tests.
 */

const logger = require('../../app/services/log.service');

// Initialize logger early.
logger.init({
  appName: 'skgbot-test',
  suppressLogging: true,
});

const log = logger.get();

// Set proper node environment
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'test';
}

// Setup unhandled promise rejection handler, helps during low-level
// testing.
process.on('unhandledRejection', (error) => {
  log.error('TEST :: Unhandled Promise Rejection', { error });
});

const app = require('../..');

const testLib = (module.exports = {});

/**
 * Core testing library, must be included by all tests.
 *
 */
testLib.init = () => {
  beforeAll(async () => {
    await app.init({ testing: true });
  });

  // Cleanly exit
  afterAll(async () => {
    await app.dispose();
  });
};

/**
 * Generates a random discord id and returns it.
 *
 * @return {string} a discord id looking string.
 */
testLib.randomDiscordUid = () => {
  let result = '';
  const characters = '0123456789';
  const discordIdLength = 21;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < discordIdLength; i++) {
    result += characters.charAt(Math.floor(Math.random() * discordIdLength));
  }
  return result;
};
