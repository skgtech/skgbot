/**
 * @fileoverview Apply initial roles to new members.
 */

const config = require('config');

const { getRole } = require('..');

const entity = (module.exports = {});

/**
 * Apply roles to a new member.
 *
 * @param {DiscordGuild} guild The guild to apply the roles to.
 * @param {DiscordGuildMember} guildMember The membeer to apply the roles on.
 * @return {Promise<void>} A Promise.
 */
entity.applyRoles = (guild, guildMember) => {
  const allPromises = [];
  config.discord.roles_for_new_member.forEach((roleName) => {
    const role = getRole(guild, roleName);

    allPromises.push(guildMember.roles.add(role));
  });

  return Promise.all(allPromises);
};
