/**
 * @fileoverview Various discord helpers, queries and methods.
 */

const {
  applyRoles,
  getRole,
  addRole,
  removeRole,
  removeAllRoles,
} = require('./logic/roles.ent');
const {
  getGuild,
  getGuildMember,
  getGuildMemberLocal,
} = require('./logic/guild.ent');
const { loggerToAdmin } = require('./logic/relay-to-admin.ent');
const { setNickname } = require('./logic/change-nickname.ent');

const entity = (module.exports = {});

entity.addRole = addRole;
entity.applyRoles = applyRoles;
entity.loggerToAdmin = loggerToAdmin;
entity.removeRole = removeRole;
entity.removeAllRoles = removeAllRoles;
entity.getGuild = getGuild;
entity.getGuildMember = getGuildMember;
entity.getGuildMemberLocal = getGuildMemberLocal;
entity.getRole = getRole;
entity.setNickname = setNickname;
