/**
 * @fileoverview The Member entity.
 */

const memberSql = require('./sql/members.sql');
const { show } = require('./logic/show-profile.ent');
const {
  changeNickname,
  validateEmail,
} = require('./logic/change-nickname.ent');
const { changeBio, validateBio } = require('./logic/change-bio.ent');
const { categoryJoin, validateCategory } = require('./logic/category-join.ent');
const { categoryPart } = require('./logic/category-part.ent');

const entity = (module.exports = {});

// Expose all related methods
entity.getById = memberSql.getById;
entity.create = memberSql.create;
entity.update = memberSql.update;
entity.getByEmail = memberSql.getByEmail;
entity.showProfile = show;
entity.changeNickname = changeNickname;
entity.validateEmail = validateEmail;
entity.changeBio = changeBio;
entity.validateBio = validateBio;
entity.categoryJoin = categoryJoin;
entity.categoryPart = categoryPart;
entity.validateCategory = validateCategory;

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

  await memberSql.create(memberInput);

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
    is_active: true,
    onboarding_state: 'joined',
  };

  await memberSql.update(guildMember.user.id, memberUpdate);

  const localMember = await memberSql.getById(guildMember.user.id);

  return localMember;
};
