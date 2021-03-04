/**
 * @fileoverview The Member entity.
 */
const { createMember } = require('./logic/create-member.ent');
const { enableMember } = require('./logic/enable-member.ent');
const { categoryPart } = require('./logic/category-part.ent');
const { categoryJoin, validateCategory } = require('./logic/category-join.ent');
const { changeBio, validateBio } = require('./logic/change-bio.ent');
const { changeNickname } = require('./logic/change-nickname.ent');
const { resetOnboarding } = require('./logic/reset-onboarding.ent');
const memberSql = require('./sql/members.sql');
const { show } = require('./logic/show-profile.ent');
const {
  verifyMember,
  verifyMemberToken,
} = require('./logic/verify-member-web.ent.js');

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
entity.createMember = createMember;
entity.resetOnboarding = resetOnboarding;
