/**
 * @fileoverview Messages for onboarding followup.
 */

const config = require('config');

const messages = (module.exports = {});

const serverName = config.discord.server_name;
const invitePermalink = config.onboarding.invite_permalink;

/**
 * Onboarding Follow Up messages
 */

messages.followUpJoined1 = (username) =>
  `Hey ${username}, you need to type \`yes\` to get started with the` +
  ` onboarding process and join ${serverName}'s channels.\n\nIf you are confused` +
  ` just message a Moderator or type \`!help\`.`;

messages.followUpDailyJoined = (username, daysDiff) =>
  `Hey ${username}, it has been ${daysDiff} day${daysDiff > 1 ? 's' : ''}` +
  ` since you joined ${serverName}'s server. You need to type \`yes\` to` +
  ` start the onboarding process.\nIf you are confused` +
  ` just message a Moderator or type \`!help\`.`;

messages.followUpDaily = (username, daysDiff, onboardingState) =>
  `Hey ${username}, it has been ${daysDiff} day${daysDiff > 1 ? 's' : ''}` +
  ` since you joined ${serverName}'s server. You need to type your` +
  ` ${onboardingState} to continue your onboarding process.\nIf you are confused` +
  ` just message a Moderator or type \`!help\`.`;

messages.followUpDailyVerify = (username, daysDiff, email) =>
  `Hey ${username}, it has been ${daysDiff} day${daysDiff > 1 ? 's' : ''}` +
  ` since you joined ${serverName}'s server. You need to type verify your` +
  ` email (${email}) so you can finish your onboarding process.\nIf you are confused` +
  ` just message a Moderator or type \`!help\`. You can also type \`!resend\`` +
  ` and I will send you a new email.`;

messages.endOfOnboarding = (username) =>
  `Hey ${username}, I am sorry but you have exceeded the maximum allowed days` +
  ` to onboard on ${serverName}'s server. You may rejoin again using the` +
  ` invitation perma-link: ${invitePermalink}`;

messages.lastDayWarning = () =>
  `\n**Warning** this is your last day to complete onboarding.`;
