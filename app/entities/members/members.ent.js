/**
 * @fileoverview The Member entity.
 */

const memberSql = require('./sql/members.sql');
const { show } = require('./logic/show-profile.ent');
const { changeNickname } = require('./logic/change-nickname.ent');
const { changeBio, validateBio } = require('./logic/change-bio.ent');
const { categoryJoin, validateCategory } = require('./logic/category-join.ent');
const { categoryPart } = require('./logic/category-part.ent');
const { enableMember } = require('./logic/enable-member.ent');
const {
  verifyMember,
  verifyMemberToken,
} = require('./logic/verify-member-web.ent.js');
const log = require('../../services/log.service').get();

const entity = (module.exports = {});

// Expose all related methods
entity.getById = memberSql.getById;
entity.create = memberSql.create;
entity.enableMember = enableMember;
entity.update = memberSql.update;
entity.getByEmail = memberSql.getByEmail;
entity.showProfile = show;
entity.changeNickname = changeNickname;
entity.changeBio = changeBio;
entity.validateBio = validateBio;
entity.categoryJoin = categoryJoin;
entity.categoryPart = categoryPart;
entity.validateCategory = validateCategory;
entity.verifyMember = verifyMember;
entity.verifyMemberToken = verifyMemberToken;

/**
 * Creates a new record in the database using the provided Discord GuildMember.
 *
 * @param {DiscordGuildMember} guildMember The guild member.
 * @return {Promise<Member>} Returns the local member representation.
 */
entity.createMember = async (guildMember) => {
  const joined_at = new Date(guildMember.joinedTimestamp);
  const memberInput = {
    discord_uid: guildMember.user.id,
    username: guildMember.user.username,
    joined_at,
  };

  const logCustom = {
    discord_uid: memberInput.discord_uid,
    username: memberInput.username,
  };

  log.info('createMember() :: Creating new Member', { custom: logCustom });

  try {
    await memberSql.create(memberInput);
  } catch (ex) {
    log.error('createMember() :: Failed to create new member', {
      error: ex,
      custom: logCustom,
    });
    throw ex;
  }

  const localMember = await memberSql.getById(guildMember.user.id);

  return localMember;
};

/**
 * Resets the onboarding state of a user.
 *
 * @param {DiscordGuildMember} guildMember The guild member.
 * @return {Promise<Member>} Returns the local member representation.
 */
entity.resetOnboarding = async (guildMember) => {
  const memberUpdate = {
    nickname: '',
    first_name: '',
    last_name: '',
    bio: '',
    is_onboarded: false,
    onboarding_state: 'joined',
  };

  await memberSql.update(guildMember.user.id, memberUpdate);

  const localMember = await memberSql.getById(guildMember.user.id);

  return localMember;
};
