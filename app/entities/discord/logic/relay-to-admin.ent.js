/**
 * @fileoverview Entity responsible for formatting and relaying select log
 *   messages to the admin channel.
 */

const BPromise = require('bluebird');
const config = require('config');

const { getClient, isConnected } = require('../../../services/discord.service');
const globals = require('../../../utils/globals');
const { splitString } = require('../../../utils/helpers');

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
  if (logContext.relay || logContext.severity < 5) {
    message = entity._formatMessage(logContext);
  } else {
    return;
  }

  const client = getClient();

  const channel = await client.channels.fetch(config.discord.admin_channel_id);

  // discord allows up to 2000 chars
  try {
    const splitMessage = splitString(message);
    await BPromise.mapSeries(splitMessage, (msg) => {
      return channel.send(msg);
    });
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
  const message = [];

  if (lc.event.error) {
    message.push(`:octagonal_sign: [${lc.level}] ${lc.message} :: `);
    message.push(`${lc.event.error.name} :: ${lc.event.error.message} :: `);
  }

  if (lc.emoji) {
    message.push(`${lc.emoji} [${lc.level}] ${lc.message}`);
  }

  // serialize localUser if it exists
  if (lc.context.localMember) {
    const lm = lc.context.localMember;
    message.push(`\nuid: ${lm.discord_uid}, uname: "${lm.username}"`);
    if (lm.email) {
      message.push(`, <${lm.email}>`);
    }
    if (lm.nickname) {
      message.push(`, nick: "${lm.nickname}"`);
    }
    if (lm.first_name) {
      message.push(`, "${lm.first_name} ${lm.last_name}"`);
    }
    message.push(`, Onboarding State: ${lm.onboarding_state}`);
  }

  // check if bio is changing
  if (lc.context.custom && lc.context.custom.old_bio) {
    message.push(
      `\nOld Bio:\n\`\`\`${lc.context.custom.old_bio}\`\`\`\n` +
        `New Bio:\n\`\`\`${lc.context.custom.new_bio}\`\`\``,
    );
  }

  if (lc.context.custom && lc.context.custom.members) {
    message.push(`\n**Members**: ${lc.context.custom.members}.`);
  }

  if (lc.context.custom && lc.context.custom.members_missing) {
    message.push(
      `\n**Members no longer in the guild**: ${lc.context.custom.members_missing}.`,
    );
  }

  if (lc.context.custom && lc.context.custom.members_removed) {
    message.push(
      `\n**Members onboarding expired and kicked**:` +
        ` ${lc.context.custom.members_removed}.`,
    );
  }

  const messageStr = message.join('');
  return messageStr;
};
