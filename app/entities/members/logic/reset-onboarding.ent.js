/**
 * @fileoverview Will reset the onboarding process for the member and start over.
 */

const { update, getById } = require('../sql/members.sql');
const log = require('../../../services/log.service').get();

const entity = (module.exports = {});

/**
 * Resets the onboarding state of a user.
 *
 * @param {DiscordGuildMember} guildMember The guild member.
 * @return {Promise<Member>} Returns the local member representation.
 */
entity.resetOnboarding = async (guildMember) => {
  const memberUpdate = {
    nickname: null,
    first_name: '',
    last_name: '',
    bio: '',
    is_onboarded: false,
    onboarding_state: 'joined',
  };

  try {
    await update(guildMember.user.id, memberUpdate);
  } catch (ex) {
    log.error('resetOnboarding() :: Error:', { error: ex });
    throw ex;
  }

  const localMember = await getById(guildMember.user.id);

  return localMember;
};
