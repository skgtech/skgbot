/**
 * @fileoverview The Member entity.
 */
const { categoryJoin } = require('./logic/category-join.ent');
const { categoryPart } = require('./logic/category-part.ent');
const { createMember } = require('./logic/create-member.ent');
const { changeBio, validateBio } = require('./logic/change-bio.ent');
const { changeNickname } = require('./logic/change-nickname.ent');
const { enableMember } = require('./logic/enable-member.ent');
const { isModerator } = require('./logic/is-moderator.ent');
const memberSql = require('./sql/members.sql');
const { resetOnboarding } = require('./logic/reset-onboarding.ent');
const { show } = require('./logic/show-profile.ent');
const {
  verifyMember,
  verifyMemberToken,
} = require('./logic/verify-member-web.ent.js');

const entity = (module.exports = {});

// Expose all related methods - order alphabetically please.
entity.categoryJoin = categoryJoin;
entity.categoryPart = categoryPart;
entity.create = memberSql.create;
entity.createMember = createMember;
entity.changeNickname = changeNickname;
entity.changeBio = changeBio;
entity.enableMember = enableMember;
entity.isModerator = isModerator;
entity.getByEmail = memberSql.getByEmail;
entity.getById = memberSql.getById;
entity.getByStateAndNotOnboardingType =
  memberSql.getByStateAndNotOnboardingType;
entity.getExists = memberSql.getExists;
entity.resetOnboarding = resetOnboarding;
entity.showProfile = show;
entity.getStaleOnboardingUsers = memberSql.getStaleOnboardingUsers;
entity.update = memberSql.update;
entity.validateBio = validateBio;
entity.verifyMember = verifyMember;
entity.verifyMemberToken = verifyMemberToken;
