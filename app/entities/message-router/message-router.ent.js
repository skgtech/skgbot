/**
 * @fileoverview Handle message commands to the bot.
 */

const discordService = require('../../services/discord.service');
const membersEnt = require('../members/members.ent');
const messages = require('./messages');
const { handleMemberCommands } = require('./router-member-command.ent');
const { handleOnboardingMessage } = require('./router-onboarding-message.ent');
const { handleOnboardingCommands } = require('./router-onboarding-command.ent');
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
  // only care for private messages. (public are  type === "text").
  if (message.channel.type !== 'dm') {
    return;
  }

  const msg = message.content;

  const discordAuthor = message.author;

  // Get local member
  const localMember = await membersEnt.getById(discordAuthor.id);

  if (!localMember) {
    message.channel.send(messages.cannotFindYou(discordAuthor.username));
    return;
  }

  // Check if not command
  if (msg[0] !== '!') {
    if (localMember.onboarding_state !== 'member') {
      // it's an onboarding member, go to onboarding message routes
      await handleOnboardingMessage(message, localMember);
    }

    // in any way, stop execution here for non command messages.
    return;
  }

  if (localMember.onboarding_state === 'member') {
    await handleMemberCommands(message, localMember);
  } else {
    await handleOnboardingCommands(message, localMember);
  }
};
