/**
 * @fileoverview Service that provides connectivity and authentication to the discord-commando API.
 */

const config = require('config');
const Commando = require('discord.js-commando');

const log = require('./log.service').get();

const commandoService = (module.exports = {});

/** @type {?Discord} Discord client */
commandoService.client = null;

commandoService.getClient = () => {
  if (!commandoService.client) {
    throw new Error(
      'Discord Service not initialized yet - client does not exist',
    );
  }

  return commandoService.client;
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

    const client = (commandoService.client = new Commando.Client({
      owner: config.discord.commando.owner_uid,
    }));

    client.on('ready', () => {
      log.notice(`Discord-Commando Connected as: ${client.user.tag}`);
      resolve();
    });

    client.on('error', (error) => {
      log.warn(
        `Discord-Commando Client Error. Connected at: ${client.readyAt}`,
        {
          error,
        },
      );

      // When no connection has been established, the service is still in initialization mode
      if (!client.readyAt) {
        reject();
      }
    });

    client.login(config.discord.token);
  });
};
