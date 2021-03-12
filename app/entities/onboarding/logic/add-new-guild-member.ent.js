/**
 * @fileoverview Creates local record and starts onboarding for new Guild Member.
 */

const { delay } = require('../../../utils/helpers');
const messages = require('../messages');
const {
  resetOnboarding,
  getById,
  createMember,
} = require('../../members/members.ent');
const log = require('../../../services/log.service').get();

const entity = (module.exports = {});

/**
 * Creates local record and starts onboarding for new Guild Member.
 *
 * @param {DiscordGuildMember} guildMember The guild member.
 * @return {Promise<void>}
 * @private
 */
entity.guildMemberAdd = async (guildMember) => {
  // Make sure member exists.
  if (!guildMember) {
    return;
  }

  let localMember = null;
  try {
    // check if member already registered
    localMember = await getById(guildMember.userID);
  } catch (ex) {
    log.error('guildMemberAdd() Failed to query for member.', {
      custom: {
        guildMember,
      },
      error: ex,
    });
    throw ex;
  }
  if (localMember) {
    log.info('_onGuildMemberAdd() :: Member already exists', { localMember });
    localMember = await resetOnboarding(guildMember);
  } else {
    log.info('_onGuildMemberAdd() :: Member does not exist, creating...');
    localMember = await createMember(guildMember);
  }

  await entity.sendFirstOnboardingDM(guildMember, localMember);
};

/**
 * Send the initial onboarding private message to the member.
 *
 * @param {DiscordGuildMember} guildMember The guild Member.
 * @param {Member} localMember Local member record.
 * @return {Promise<void>}
 */
entity.sendFirstOnboardingDM = async (guildMember, localMember) => {
  await log.info('New member joined the guild!', {
    localMember,
    relay: true,
    emoji: ':egg:',
  });
  const dmChannel = await guildMember.createDM();

  // Send the message, starting the entity process.
  await dmChannel.send(messages.welcome1(guildMember));
  await delay(6);
  await dmChannel.send(messages.welcome2(guildMember));
};
