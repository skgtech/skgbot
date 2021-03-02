/**
 * @fileoverview Apply initial roles to new members.
 */

const config = require('config');

const { getGuild } = require('./guild.ent');

const entity = (module.exports = {});

/**
 * Apply roles to a new member.
 *
 * @param {DiscordGuild} guild The guild to apply the roles to.
 * @param {DiscordGuildMember} guildMember The member to apply the roles on.
 * @return {Promise<void>} A Promise.
 */
entity.applyRoles = async (guildMember) => {
  const guild = await getGuild();
  const allPromises = [];
  config.discord.roles_for_new_member.forEach((roleName) => {
    const role = entity.getRole(guild, roleName);

    allPromises.push(guildMember.roles.add(role));
  });

  return Promise.all(allPromises);
};

/**
 * Returns the role discord object.
 *
 * @param {DiscordGuild} guild The guild to look the role into.
 * @param {string} roleName The role name to look for.
 * @return {DiscordRole} Returns the discord role.
 */
entity.getRole = (guild, roleName) => {
  const role = guild.roles.cache.find((roleItem) => roleItem.name === roleName);

  return role;
};
