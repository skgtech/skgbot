/**
 * @fileoverview Messages for onboarding followup.
 */

const config = require('config');

const messages = (module.exports = {});

const serverName = config.discord.server_name;

/**
 * Onboarding Follow Up messages
 */

messages.followUpJoined1 = (username) =>
  `Hey ${username}, you need to type \`yes\` to create` +
  ` your public profile.\n\nIf you are confused` +
  ` just message a Moderator or type \`!help\`.`;

messages.followUpDailyJoined = (username, daysDiff) =>
  `Hey ${username}, it has been ${daysDiff} day${daysDiff > 1 ? 's' : ''}` +
  ` since you joined ${serverName}'s server. You need to type \`yes\` to` +
  ` create your public profile.\nIf you are confused` +
  ` just message a Moderator or type \`!help\`.`;

messages.followUpDaily = (username, daysDiff, onboardingState) =>
  `Hey ${username}, it has been ${daysDiff} day${daysDiff > 1 ? 's' : ''}` +
  ` since you joined ${serverName}'s server. You need to type your` +
  ` ${onboardingState} to continue creating your public profile.\nIf you are confused` +
  ` just message a Moderator or type \`!help\`.`;

messages.followUpDailyVerify = (username, daysDiff, email) =>
  `Hey ${username}, it has been ${daysDiff} day${daysDiff > 1 ? 's' : ''}` +
  ` since you joined ${serverName}'s server. You need to type verify your` +
  ` email (${email}) so you can finish your public profile.\nIf you are confused` +
  ` just message a Moderator or type \`!help\`. You can also type \`!resend\`` +
  ` and I will send you a new email.`;
