/**
 * @fileoverview Messages for onboarding followup.
 */

const config = require('config');

const messages = (module.exports = {});

const serverName = config.discord.server_name;

/**
 * Onboarding Follow Up messages
 */

messages.followupJoined1 = (username) =>
  `Hey ${username}, you need to type \`yes\` to get started with the` +
  ` onboarding process and join ${serverName}'s channels.\n\nIf you are confused` +
  ` just message a Moderator or type \`!help\`.`;
