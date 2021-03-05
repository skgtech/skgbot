/**
 * @fileoverview Checks if a member is banned from joining a category (role).
 */

const { getByMemberId } = require('../sql/moderation.sql');

const entity = (module.exports = {});

/**
 * Checks if a member is banned from joining a category (role).
 *
 * @param {Member} localMember The local member.
 * @param {string} category Canonnical category name.
 * @return {Promise<boolean>} A Promise with the response.
 */
entity.canJoin = async (localMember, category) => {
  const banRecords = await getByMemberId(localMember.discord_uid);

  if (banRecords.length === 0) {
    return true;
  }

  const canJoin = banRecords.reduce((outcome, banRecord) => {
    if (!outcome) {
      return false;
    }
    if (banRecord.category === '*') {
      return false;
    }
    if (banRecord.category === category) {
      return false;
    }
    return true;
  }, true);

  return canJoin;
};
