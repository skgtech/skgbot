/**
 * @fileoverview Messages needed for moderation entity.
 */

const { failed } = require('../members/messages');

const messages = (module.exports = {});

messages.failed = () => `${failed()}`;
messages.banSuccess = (memberDiscordId, category) =>
  `Ban added for discord member with id ${memberDiscordId} on category: ${category}`;
messages.unbanSuccess = (memberDiscordId, category) =>
  `Ban removed for discord member with id ${memberDiscordId} on category:` +
  ` ${category}.`;
messages.unbanNotExist = () =>
  'There was no ban found based on the arguments you provided';
