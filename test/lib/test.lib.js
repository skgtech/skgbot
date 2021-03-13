/**
 * @fileoverview Core testing library, must be included by all tests.
 */

const faker = require('faker');
const logger = require('../../app/services/log.service');

// Initialize logger early.
logger.init({
  appName: 'skgbot-test',
  suppressLogging: false,
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

const commandoService = require('../../app/services/discord.service');

const testLib = (module.exports = {});

// Mock discord client
testLib.discordOn = jest.fn();
commandoService._client = {
  on: testLib.discordOn,
  user: {
    id: faker.random.number(999999999999999999),
  },
};

const app = require('../..');

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
