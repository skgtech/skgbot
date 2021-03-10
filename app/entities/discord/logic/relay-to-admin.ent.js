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

  // discord allows up to 2000 chars
  try {
    if (message.length > 1999) {
      const part1 = message.substring(0, 1800);
      const part2 = message.substring(1800);
      await channel.send(part1);
      await channel.send(part2);
    } else {
      await channel.send(message);
    }
  } catch (ex) {
    // eslint-disable-next-line no-console
    console.error('Error relaying message to admin channel', { error: ex });
  }

  delete logContext.emoji;
};

/**
 * Format log message to a string.
 *
 * @param {Object} lc Logality log context object.
 * @return {string} The string message.
 * @private
 */
entity._formatMessage = (lc) => {
  let message = `${lc.emoji} [${lc.level}] ${lc.message}`;
  // serialize localUser if it exists
  if (lc.context.localMember) {
    const lm = lc.context.localMember;
    message += `\nuid: ${lm.discord_uid}, ${lm.username}`;
    if (lm.email) {
      message += `, <${lm.email}>`;
    }
    if (lm.nickname) {
      message += `, "${lm.nickname}"`;
    }
    if (lm.first_name) {
      message += `, "${lm.first_name} ${lm.last_name}"`;
    }
    message += `, Onboarding State: ${lm.onboarding_state}`;
  }

  // check if bio is changing
  if (lc.context.custom && lc.context.custom.old_bio) {
    message +=
      `\nOld Bio:\n\`\`\`${lc.context.custom.old_bio}\`\`\`\n` +
      `New Bio:\n\`\`\`${lc.context.custom.new_bio}\`\`\``;
  }

  if (lc.context.custom && lc.context.custom.members) {
    message += `\nMembers: ${lc.context.custom.members}.`;
  }

  if (lc.context.custom && lc.context.custom.members_missing) {
    message += `\nMembers no longer in the guild: ${lc.context.custom.members_missing}.`;
  }

  if (lc.context.custom && lc.context.custom.members_removed) {
    message +=
      `\nMembers onboarding expired and kicked:` +
      ` ${lc.context.custom.members_removed}.`;
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
  let message = `:octagonal_sign: [${lc.level}] ${lc.message} :: `;

  if (lc.event.error) {
    message += `${lc.event.error.name} :: ${lc.event.error.message}`;
  }

  return message;
};
