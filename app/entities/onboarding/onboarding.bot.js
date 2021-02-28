/**
 * @fileoverview Onboarding of Discord users.
 */

const discordService = require('../../services/discord.service');
const membersEnt = require('../members/members.ent');
const messages = require('./messages');
const log = require('../../services/log.service').get();

const { handle1 } = require('./logic/onboarding-step1-approve.ent');
const { handle2 } = require('./logic/onboarding-step2-first-name.ent');
const { handle3 } = require('./logic/onboarding-step3-last-name.ent');
const { handle4 } = require('./logic/onboarding-step4-email.ent');
const { handle5 } = require('./logic/onboarding-step5-bio.ent');
const { handle6 } = require('./logic/onboarding-step6-nickname.ent');

const onboarding = (module.exports = {});

/**
 * Initialize Discord event listeners for performing onboarding.
 *
 */
onboarding.init = () => {
  log.info('Initializing onboarding entity...');
  const client = discordService.getClient();

  // Create an event listener for new guild members
  client.on('guildMemberAdd', onboarding._onGuildMemberAdd);

  client.on('message', onboarding._onMessage);
};

/**
 * Reset the onboarding process for this member.
 *
 * @param {DiscordGuildMember} guildMember The guild Member.
 * @return {Promise<Member>}
 */
onboarding.resetOnboarding = async (guildMember) => {
  const localMember = await membersEnt.resetOnboarding(guildMember);
  return localMember;
};

/**
 * Manually register for non-registered members.
 *
 * @param {DiscordMessage} message The guild Member.
 * @param {Member} localMember Local member record.
 * @return {Promise<void>} A Promise.
 */
onboarding.startOnboarding = async (message, localMember) => {
  if (localMember.onboarding_state === 'member') {
    await message.channel.send(messages.alreadyRegistered());
    return;
  }

  // Send the message, starting the onboarding process.
  await message.channel.send(messages.welcome(message.member));
};

/**
 * Handles new member being added to the server, initiates onboarding
 * sequence.
 *
 * @param {DiscordGuildMember} guildMember The guild member.
 * @return {Promise<void>}
 * @private
 */
onboarding._onGuildMemberAdd = async (guildMember) => {
  // Make sure member exists.
  if (!guildMember) {
    return;
  }

  // check if member already registered
  let localMember = await membersEnt.getById(guildMember.id);

  if (localMember) {
    localMember = await onboarding.resetOnboarding(guildMember);
  } else {
    localMember = await membersEnt.createMember(guildMember);
  }

  const channel = await guildMember.createDM();

  // Do nothing if the channel wasn't found on this server
  if (!channel) {
    return;
  }

  // Send the message, starting the onboarding process.
  await channel.send(messages.welcome(guildMember));
};

/**
 * Handles incoming message from discord.
 *
 * @param {DiscordMessage} message Discord Message Object.
 * @private
 */
onboarding._onMessage = async (message) => {
  // Ignore commands
  if (message[0] === '!') {
    return;
  }

  const discordAuthor = message.author;

  // Get local member
  const localMember = await membersEnt.getById(discordAuthor.id);

  // if not on the database, exit.
  if (!localMember) {
    return;
  }

  if (localMember.onboarding_state === 'member') {
    message.channel.send(messages.cannotUnderstandYou());
    return;
  }

  // Handle the message based on the member's current onboarding state.
  switch (localMember.onboarding_state) {
    case 'joined':
      await handle1(message, localMember);
      break;
    case 'first_name':
      await handle2(message, localMember);
      break;
    case 'last_name':
      await handle3(message, localMember);
      break;
    case 'email':
      await handle4(message, localMember);
      break;
    case 'bio':
      await handle5(message, localMember);
      break;
    case 'nickname':
      await handle6(message, localMember);
      break;
    default:
      log.error(
        `Bogus member "onboarding_state": ${localMember.onboarding_state}`,
        {
          custom: {
            onboarding_state: localMember.onboarding_state,
          },
        },
      );
      break;
  }
};
