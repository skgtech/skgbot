/**
 * @fileoverview Entity responsible for formatting and relaying select log
 *   messages to the admin channel.
 */

const config = require('config');

const { getClient, isConnected } = require('../../../services/discord.service');
const globals = require('../../../utils/globals');

const entity = (module.exports = {});

/**
 * Middleware for logality, will relay select log messages to the admin channel.
 *
 * @param {Object} logContext Logality log context object.
 * @return {Promise<void>} A Promise.
 */
entity.loggerToAdmin = async (logContext) => {
  // Don't log when not connected to discord
  if (!isConnected()) {
    return;
  }

  // don't relay when testing
  if (globals.isTest) {
    return;
  }

  // only deal with logs to relay or errors.
  let message;
  if (logContext.relay) {
    message = entity._formatMessage(logContext);
  } else if (logContext.severity < 5) {
    message = entity._formatError(logContext);
  } else {
    return;
  }

  const client = getClient();

  const channel = await client.channels.fetch(config.discord.admin_channel_id);
  await channel.send(message);
};

/**
 * Format log message to a string.
 *
 * @param {Object} lc Logality log context object.
 * @return {string} The string message.
 * @private
 */
entity._formatMessage = (lc) => {
  let message = `[${lc.level}] ${lc.message}`;
  // serialize localUser if it exists
  if (lc.context.localMember) {
    const lm = lc.context.localMember;
    message +=
      `\nuid: ${lm.discord_uid}, <${lm.email}>, Username: ` +
      `"${lm.username}", Nickname: "${lm.nickname}", Fullname: "${lm.full_name}"` +
      `, State: ${lm.onboarding_state}`;
  }

  // check if bio is changing
  if (lc.context.custom && lc.context.custom.old_bio) {
    message +=
      `\nOld Bio:\n\`\`\`${lc.context.custom.old_bio}\`\`\`\n\n` +
      `New Bio:\n\`\`\`${lc.context.custom.new_bio}\`\`\``;
  }

  return message;
};

/**
 * Format log Error message to a string.
 *
 * @param {Object} lc Logality log context object.
 * @return {string} The string message.
 * @private
 */
entity._formatError = (lc) => {
  const message = `[${lc.level}] ${lc.message}`;

  return message;
};
