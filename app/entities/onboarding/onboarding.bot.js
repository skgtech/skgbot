/**
 * @fileoverview Onboarding of Discord users.
 */

const discordService = require('../../services/discord.service');
const membersEnt = require('../members/members.ent');
const log = require('../../services/log.service').get();

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
    localMember = await onboarding._resetOnboarding(guildMember);
  } else {
    localMember = await membersEnt.createMember(guildMember);
  }

  // Send the message to a designated channel on a server:
  // const channel = member.guild.channels.cache.find(
  //   (ch) => ch.name === 'bot-test',
  // );

  const channel = await guildMember.createDM();

  // Do nothing if the channel wasn't found on this server
  if (!channel) {
    return;
  }

  // Send the message, mentioning the member
  await channel.send(`Welcome to the server, ${guildMember}`);
};

/**
 * Handles incoming message from discord.
 *
 * @param {DiscordMessage} message Discord Message Object.
 * @private
 */
onboarding._onMessage = async (message) => {
  if (message.content === 'ayy') {
    message.channel.send('Ayy, lmao!');
  }
  if (message.content === 'wat') {
    message.channel.send('Say what?');
  }
  if (message.content === 'lol') {
    message.channel.send('roflmaotntpmp');
  }
};

/**
 * Reset the onboarding process for this member.
 *
 * @param {DiscordGuildMember} guildMember The guild Member.
 * @return {Promise<Member>}
 * @private
 */
onboarding._resetOnboarding = async (guildMember) => {
  const localMember = await membersEnt.resetOnboarding(guildMember);
  return localMember;
};
