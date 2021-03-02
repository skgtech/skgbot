/**
 * @fileoverview Various discord helpers, queries and methods.
 */

const { applyRoles, getRole } = require('./logic/apply-roles.ent');
const { getGuild, getGuildMember } = require('./logic/guild.ent');
const { loggerToAdmin } = require('./logic/relay-to-admin.ent');

const entity = (module.exports = {});

entity.applyRoles = applyRoles;
entity.loggerToAdmin = loggerToAdmin;
entity.getGuild = getGuild;
entity.getGuildMember = getGuildMember;
entity.getRole = getRole;
