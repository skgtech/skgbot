/**
 * @fileoverview Entity responsible for formatting and relaying select log
 *   messages to the admin channel.
 */

const config = require('config');

const { getClient } = require('../../../services/discord.service');

const entity = (module.exports = {});

/**
 * Middleware for logality, will relay select log messages to the admin channel.
 *
 * @param {Object} logContext Logality log context object.
 * @return {Promise<void>} A Promise.
 */
entity.loggerToAdmin = async (logContext) => {
  // only deal with logs to relay.
  if (!logContext.context.relay) {
    return;
  }

  const message = entity._formatMessage(logContext);

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
  let message = `[${lc.level}] ${lc.message} :: `;

  // serialize localUser if it exists
  if (lc.context.localUser) {
    const lu = lc.context.localUser;
    message +=
      `\nuid: ${lu.discord_uid}, <${lu.email}>, Username: ` +
      `"${lu.username}", Nickname: "${lu.nickname}, Fullname: "${lu.first_name}` +
      ` ${lu.last_name}", State: ${lu.onboarding_state}`;
  }

  // check if bio is changing
  if (lc.context.custom && lc.context.custom.old_bio) {
    message +=
      `\nOld Bio: ${lc.context.custom.old_bio}\n\n` +
      `New Bio: ${lc.context.custom.new_bio}`;
  }

  return message;
};
