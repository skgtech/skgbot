/**
 * @fileoverview Various discord helpers, queries and methods.
 */

const {
  applyRolesToNewMember,
  getRole,
  addRole,
  removeRole,
  removeAllRoles,
} = require('./logic/roles.ent');
const {
  getGuild,
  getGuildMember,
  getGuildMemberLocal,
  getGuildMemberUid,
  getOnboardingMembers,
  getGuildChannel,
  getGuildMembers,
} = require('./logic/guild.ent');
const { loggerToAdmin } = require('./logic/relay-to-admin.ent');
const { setNickname } = require('./logic/change-nickname.ent');

const entity = (module.exports = {});

entity.addRole = addRole;
entity.applyRolesToNewMember = applyRolesToNewMember;
entity.loggerToAdmin = loggerToAdmin;
entity.removeRole = removeRole;
entity.removeAllRoles = removeAllRoles;
entity.getGuild = getGuild;
entity.getGuildMember = getGuildMember;
entity.getGuildMemberLocal = getGuildMemberLocal;
entity.getGuildMemberUid = getGuildMemberUid;
entity.getRole = getRole;
entity.setNickname = setNickname;
entity.getGuildChannel = getGuildChannel;
entity.getOnboardingMembers = getOnboardingMembers;
entity.getGuildMembers = getGuildMembers;
