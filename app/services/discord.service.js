/**
 * @fileoverview Service that provides connectivity and authentication to the
 *  discord-commando API.
 */

const config = require('config');
const Commando = require('discord.js-commando');

const simjoin = require('../entities/onboarding/simjoin.cmd');

const log = require('./log.service').get();

const commandoService = (module.exports = {});

/**
 * @type {?Discord} Discord client
 * @private
 */
commandoService._client = null;

/**
 * Returns the Discord Command instance.
 *
 * @return {Discord} Discord client.
 * @throws {Error} when discord is disconnected.
 */
commandoService.getClient = () => {
  if (!commandoService._client) {
    throw new Error(
      'Discord Service not initialized yet - client does not exist',
    );
  }

  return commandoService._client;
};

/**
 * Checks if service is connected to Discord.
 *
 * @return {boolean}
 */
commandoService.isConnected = () => {
  return !!commandoService._client;
};

/**
 * Initialize and connect to the Discord API.
 *
 * @return {Promise<void>} A Promise.
 */
commandoService.init = async function () {
  return new Promise((resolve, reject) => {
    log.notice('Starting Discord-Commando Service...', {
      custom: {
        owner_uid: config.discord.commando.owner_uid,
      },
    });

    const client = (commandoService._client = new Commando.Client({
      owner: config.discord.commando.owner_uid,
    }));

    client.on('ready', () => {
      log.notice(`Discord-Commando Connected as: ${client.user.tag}`);

      // declare all custom commands.
      const commands = [simjoin];

      // Register custom commands.
      client.registry
        .registerGroups([['testing', 'Commands to test joining and leaving']])
        .registerCommands(commands);

      resolve();
    });

    client.on('error', (error) => {
      log.warn(
        `Discord-Commando Client Error. Connected at: ${client.readyAt}`,
        {
          error,
        },
      );

      // When no connection has been established, the service is still in
      // initialization mode
      if (!client.readyAt) {
        reject();
      }
    });

    client.login(config.discord.token);
  });
};
