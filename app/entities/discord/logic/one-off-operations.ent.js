/**
 * @fileoverview One-off operations that need to be run on Discord server.
 */

const { asyncMapCap } = require('../../../utils/helpers');
const { getJoinedMembers } = require('./guild.ent');
const log = require('../../../services/log.service').get();

const entity = (module.exports = {});

/**
 * Run any one-off tasks.
 *
 * @return {Promise<void>} A Promise.
 */
entity.init = async () => {
  // await entity.addAllRoles();
};

/**
 * Will add all roles to all joined members.
 *
 * @return {Promise<void>} A Promise.
 */
entity.addAllRoles = async () => {
  await log.notice('Running "AddAllRoles()" task.');
  const allJoinedMembers = await getJoinedMembers();

  log.info(`Total Joined Members: ${allJoinedMembers.size}`);

  const allRoles = [
    '816985057280524296', // Product
    '814450728403468309', // Investor
    '814450733306609694', // Hobbies
    '814567718434373682', // Engineer
    '816976643871473685', // Politics
    '817687869569105990', // Sports
  ];

  const allRoleNames = [
    'Product',
    'Investor',
    'Hobbies',
    'Engineer',
    'Politics',
    'Sports',
  ];

  asyncMapCap(allJoinedMembers, async ([, guildMember]) => {
    const rolesAdded = [];
    await Promise.all(
      allRoles.map((roleId, index) => {
        // Check if member already joined
        if (guildMember.roles.cache.has(roleId)) {
          return false;
        }

        rolesAdded.push(index);
        return guildMember.roles.add(roleId);
      }),
    );

    const roleNamesAdded = rolesAdded.map(
      (addedIndex) => allRoleNames[addedIndex],
    );

    console.log(
      `Added to ${guildMember.user.username}: ${roleNamesAdded.join(', ')}`,
    );
  });
};
