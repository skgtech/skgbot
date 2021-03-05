/**
 * @fileoverview Apply initial roles to new members.
 */

const config = require('config');

const { getGuild, getGuildMemberUid } = require('./guild.ent');
const log = require('../../../services/log.service').get();

const entity = (module.exports = {});

/**
 * Apply roles to a new member.
 *
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

  let promiseReturn;
  try {
    promiseReturn = Promise.all(allPromises);
  } catch (ex) {
    const user = guildMember.user.username;
    await log.error(
      `applyRoles() :: Error on applying roles for user ${user}`,
      {
        error: ex,
      },
    );
  }

  return promiseReturn;
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

/**
 * Adds role to discord member.
 *
 * @param {DiscordMemberId} discordMemberId Discord member id.
 * @param {string} category Case Sensitive cannonical category name (role).
 * @return {Promise<boolean>} False if member does already has that role.
 */
entity.addRole = async (discordMemberId, category) => {
  const guild = await getGuild();
  const guildMember = await getGuildMemberUid(discordMemberId);

  const role = entity.getRole(guild, category);

  // Check if member already joined
  if (guildMember.roles.cache.has(role.id)) {
    return false;
  }

  await guildMember.roles.add(role);
};

/**
 * Removes role from discord member.
 *
 * @param {DiscordMemberId} discordMemberId Discord member id.
 * @param {string} category Case Sensitive cannonical category name (role).
 * @return {Promise<boolean>} False if member does not have that role.
 */
entity.removeRole = async (discordMemberId, category) => {
  const guild = await getGuild();
  const guildMember = await getGuildMemberUid(discordMemberId);

  const role = entity.getRole(guild, category);

  // Check if member already joined
  if (!guildMember.roles.cache.has(role.id)) {
    return false;
  }

  await guildMember.roles.remove(role);
};

/**
 * Removes all roles from a member.
 *
 * @param {DiscordMemberId} discordMemberId Discord Member id to remove role from.
 * @return {Promise<boolean>} False if member does not have that role.
 */
entity.removeAllRoles = async (discordMemberId) => {
  const guildMember = await getGuildMemberUid(discordMemberId);
  const promises = [];
  guildMember.roles.cache.forEach((role) => {
    if (role.name === '@everyone') {
      // skip everyone
      return;
    }
    promises.push(guildMember.roles.remove(role));
  });

  return Promise.all(promises);
};
