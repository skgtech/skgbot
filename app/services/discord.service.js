/**
 * @fileoverview Service that provides connectivity and authentication to the discord API.
 */

const config = require('config');
const Discord = require('discord.js');

const log = require('./log.service').get();

const discord = (module.exports = {});

/** @type {?Discord} Discord client */
discord.client = null;

/**
 * Initialize and connect to the Discord API.
 *
 * @return {Promise<void>} A Promise.
 */
discord.init = async function () {
  return new Promise((resolve, reject) => {
    log.notice('Starting Discord Service...');
    discord.client = new Discord.Client();

    discord.client.on('ready', () => {
      log.notice(`Connected as: ${discord.client.user.tag}`);
      resolve();
    });

    discord.client.on('error', (error) => {
      log.warn(
        `Discord Client Error. Connected at: ${discord.client.readyAt}`,
        {
          error,
        },
      );

      // When no connection has been established, the service is still in initialization mode
      if (!discord.client.readyAt) {
        reject();
      }
    });

    discord.client.login(config.discord.token);
  });
};
