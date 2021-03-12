/**
 * @fileoverview Displays the profile of a user.
 */

const memberSql = require('../sql/members.sql');
const {
  cannotFindMember,
  showProfile,
  showProfileAdmin,
} = require('../messages');
const { isModerator } = require('./is-moderator.ent');
const log = require('../../../services/log.service').get();

const memberProfile = (module.exports = {});

/**
 * Show a member's profile from the data store.
 *
 * @param {DiscordMessage} message The incoming message.
 * @param {Member} localMember The fetched local member.
 * @param {string} nickname The nickname to query for.
 * @return {Promise<void>}
 */
memberProfile.show = async (message, localMember, nickname) => {
  if (typeof nickname !== 'string' || !nickname) {
    message.channel.send(cannotFindMember());
    return;
  }
  log.info('Member profile show requested', localMember);
  const profile = await memberSql.getByNickname(nickname);

  if (!profile) {
    message.channel.send(cannotFindMember());
    return;
  }

  message.channel.send(showProfile(profile));

  const isMod = await isModerator(message);
  if (isMod) {
    message.channel.send(showProfileAdmin(profile));
  }
};
