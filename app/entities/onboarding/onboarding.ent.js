/**
 * @fileoverview Onboarding of new Discord members.
 */

const config = require('config');

const discordService = require('../../services/discord.service');
const globals = require('../../utils/globals');
const log = require('../../services/log.service').get();

const {
  registerNewMember,
  sendFirstOnboardingDM,
} = require('./logic/register-new-member.ent');
const { handle1 } = require('./logic/onboarding-step1-approve.ent');
const { handle2 } = require('./logic/onboarding-step2-first-name.ent');
const { handle3 } = require('./logic/onboarding-step3-last-name.ent');
const { handle4 } = require('./logic/onboarding-step4-email.ent');
const { handle5 } = require('./logic/onboarding-step5-bio.ent');
const { handle6 } = require('./logic/onboarding-step6-nickname.ent');
const { handle7 } = require('./logic/onboarding-step7-verification-bot.ent');
const {
  verifyMemberWeb,
} = require('./logic/onboarding-step7-verification-web.ent');
const { resendVerification } = require('./logic/resend-verification.ent');

const entity = (module.exports = {});

// export the steps and methods
entity.handle1 = handle1;
entity.handle2 = handle2;
entity.handle3 = handle3;
entity.handle4 = handle4;
entity.handle5 = handle5;
entity.handle6 = handle6;
entity.handle7 = handle7;
entity.verifyMemberWeb = verifyMemberWeb;
entity.resendVerification = resendVerification;
entity.registerNewMember = registerNewMember;
entity.sendFirstOnboardingDM = sendFirstOnboardingDM;

/**
 * Initialize Discord event listeners for performing onboarding.
 *
 */
entity.init = () => {
  log.info('Initializing onboarding entity...');
  const client = discordService.getClient();

  // Create an event listener for new guild members
  client.on('guildMemberAdd', entity._onGuildMemberAdd);
};

/**
 * Handles new member being added to the server, initiates entity
 * sequence.
 *
 * @param {DiscordGuildMember} guildMember The guild member.
 * @return {Promise<void>}
 * @private
 */
entity._onGuildMemberAdd = async (guildMember) => {
  // Do not onboard members when on local development
  if (
    globals.isLocal &&
    guildMember.user.id !== config.discord.commando.owner_uid
  ) {
    return;
  }
  log.info(
    `_onGuildMemberAdd() :: New guildmember added. Has guildMember: ${!!guildMember}`,
  );

  // Make sure member exists.
  if (!guildMember) {
    return;
  }

  await registerNewMember(guildMember);
};
