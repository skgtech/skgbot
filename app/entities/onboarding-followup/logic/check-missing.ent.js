/**
 * @fileoverview Checks for members that got missed by the bot and adds them
 *   to the local store and inits onboarding.
 */

const { registerNewMember } = require('../../onboarding');
const { asyncMapCap } = require('../../../utils/helpers');
const { getExists } = require('../../members');
const { getOnboardingMembers } = require('../../discord');

const log = require('../../../services/log.service').get();

const entity = (module.exports = {});

/**
 *Checks for members that got missed by the bot and adds them
 *   to the local store and inits onboarding.
 *
 * Runs every 10 minutes from the task manager (cron).
 *
 * @return {Promise} A Promise, errors are not handled, handle them inline.
 */
entity.run = async () => {
  try {
    const onboardingGuildMembers = await getOnboardingMembers();

    if (onboardingGuildMembers.length === 0) {
      return;
    }

    const missingGuildMembers = await entity._checkMissing(
      onboardingGuildMembers,
    );

    if (missingGuildMembers.size === 0) {
      return;
    }
    await entity._onboardMissingMembers(missingGuildMembers);
  } catch (ex) {
    log.error('checkMissing run() Error', { error: ex });
  }
};

/**
 * Will check if any of the provided guild members are not registered in the
 * local database and return them.
 *
 * @param {Array<GuildMember>} onboardingGuildMembers Array of onboarding guild
 *  members.
 * @return {Promise<Array<GuildMember>>} A Promise with the Guild Members that
 *  were not found on local data store.
 * @private
 */
entity._checkMissing = async (onboardingGuildMembers) => {
  const discordIds = onboardingGuildMembers.map((member) => member.id);
  const foundMembers = await getExists(discordIds);

  const foundMemberIds = foundMembers.map((member) => member.discord_uid);

  const missingGuildMembers = onboardingGuildMembers.filter(
    (member) => !foundMemberIds.includes(member.id),
  );

  return missingGuildMembers;
};

/**
 * Will initiate onboarding sequence for all missing members.
 *
 * @param {Map<DiscordGuildMembers>} missingGuildMembers Array of Guild Members.
 * @return {Promise<void>} A Promise.
 * @private
 */
entity._onboardMissingMembers = async (missingGuildMembers) => {
  const missingMembers = [];
  missingGuildMembers.forEach((member) =>
    missingMembers.push(`${member.id}:${member.user.username}`),
  );
  await log.info(
    `Found ${missingMembers.length} missing members, starting onboarding...`,
    {
      custom: {
        members_missing: missingMembers.join(', '),
      },
    },
  );

  return asyncMapCap(missingGuildMembers, ([, guildMember]) => {
    // GuildMembers is a map, so the "guildMember" in this context
    // is a tuple containg the ID and the object
    return registerNewMember(guildMember);
  });
};
