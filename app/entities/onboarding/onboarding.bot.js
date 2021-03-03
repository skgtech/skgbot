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
const {
  handle7,
  resendVerification,
} = require('./logic/onboarding-step7-verification.ent');

const onboarding = (module.exports = {});

// export the steps and methods
onboarding.handle1 = handle1;
onboarding.handle2 = handle2;
onboarding.handle3 = handle3;
onboarding.handle4 = handle4;
onboarding.handle5 = handle5;
onboarding.handle6 = handle6;
onboarding.handle7 = handle7;
onboarding.resendVerification = resendVerification;

/**
 * Initialize Discord event listeners for performing onboarding.
 *
 */
onboarding.init = () => {
  log.info('Initializing onboarding entity...');
  const client = discordService.getClient();

  // Create an event listener for new guild members
  client.on('guildMemberAdd', onboarding._onGuildMemberAdd);
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
  log.info(
    `_onGuildMemberAdd() :: New guildmember added. Has guildMember: ${!!guildMember}`,
  );

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

  await onboarding.sendFirstOnboardingDM(guildMember, localMember);
};

/**
 * Send the initial onboarding private message to the member.
 *
 * @param {DiscordGuildMember} guildMember The guild Member.
 * @param {Member} localMember Local member record.
 * @return {Promise<void>}
 */
onboarding.sendFirstOnboardingDM = async (guildMember, localMember) => {
  await log.info('New member joined the guild!', {
    localMember,
    relay: true,
  });
  const dmChannel = await guildMember.createDM();

  // Send the message, starting the onboarding process.
  await dmChannel.send(messages.welcome(guildMember));
};
