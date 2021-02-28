/**
 * @fileoverview Handle message commands to the bot.
 */

const discordService = require('../../services/discord.service');
const membersEnt = require('../members/members.ent');
const messages = require('./messages');
const { startOnboarding } = require('../onboarding');
const log = require('../../services/log.service').get();

const messageRouter = (module.exports = {});

/**
 * Initialize Discord event listeners for performing message router.
 *
 */
messageRouter.init = () => {
  log.info('Initializing message router entity...');
  const client = discordService.getClient();

  client.on('message', messageRouter._onMessage);
};

/**
 * Handles incoming message commands from discord.
 *
 * @param {DiscordMessage} message Discord Message Object.
 * @private
 */
messageRouter._onMessage = async (message) => {
  // only care for private messages. (public are "text").
  if (message.channel.type !== 'dm') {
    return;
  }

  const msg = message.content;

  // Only parse commands
  if (msg[0] !== '!') {
    return;
  }
  const discordAuthor = message.author;

  // Get local member
  const localMember = await membersEnt.getById(discordAuthor.id);

  if (!localMember) {
    message.channel.send(messages.cannotFindYou(discordAuthor.username));
    return;
  }

  if (localMember.onboarding_state === 'member') {
    await messageRouter._handleMember(message, localMember);
  } else {
    await messageRouter._handleOnboarding(message, localMember);
  }
};

/**
 * Handles commands from members.
 *
 * @param {DiscordMessage} message The incoming message.
 * @param {Member} localMember The local member.
 * @return {Promise(<void>)} A Promise.
 * @private
 */
messageRouter._handleMember = async (message, localMember) => {
  const parts = message.content.split(' ');

  switch (parts[0]) {
    case '!help':
      await message.channel.send(messages.help());
      break;
    case '!register':
      await startOnboarding(message, localMember);
      break;

    // Resend the email verification code.
    case '!resend':
      break;
    default:
      await message.channel.send(messages.error());
      break;
  }
};
