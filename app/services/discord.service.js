/**
 * @fileoverview Service that provides connectivity and authentication to the discord API.
 */

const config = require('config');
const Discord = require('discord.js');

const log = require('./log.service').get();

const discordService = (module.exports = {});

/** @type {?Discord} Discord client */
discordService.client = null;

discordService.getClient = () => {
  if (!discordService.client) {
    throw new Error(
      'Discord Service not initialized yet - client does not exist',
    );
  }

  return discordService.client;
};

/**
 * Initialize and connect to the Discord API.
 *
 * @return {Promise<void>} A Promise.
 */
discordService.init = async function () {
  return new Promise((resolve, reject) => {
    log.notice('Starting Discord Service...');
    discordService.client = new Discord.Client();

    discordService.client.on('ready', () => {
      log.notice(`Discord Connected as: ${discordService.client.user.tag}`);
      resolve();
    });

    discordService.client.on('error', (error) => {
      log.warn(
        `Discord Client Error. Connected at: ${discordService.client.readyAt}`,
        {
          error,
        },
      );

      // When no connection has been established, the service is still in initialization mode
      if (!discordService.client.readyAt) {
        reject();
      }
    });

    discordService.client.login(config.discord.token);
  });
};
