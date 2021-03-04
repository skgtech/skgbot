/**
 * @fileoverview Creates a new record in the database using the provided
 *    Discord GuildMember.
 */

const { create, getById } = require('../sql/members.sql');
const log = require('../../../services/log.service').get();

const entity = (module.exports = {});

/**
 * Creates a new record in the database using the provided Discord GuildMember.
 *
 * @param {DiscordGuildMember} guildMember The guild member.
 * @return {Promise<Member>} Returns the local member representation.
 */
entity.createMember = async (guildMember) => {
  const joined_at = new Date(guildMember.joinedTimestamp);
  const memberInput = {
    discord_uid: guildMember.user.id,
    username: guildMember.user.username,
    joined_at,
  };

  const logCustom = {
    discord_uid: memberInput.discord_uid,
    username: memberInput.username,
  };

  log.info('createMember() :: Creating new Member', { custom: logCustom });

  try {
    await create(memberInput);
  } catch (ex) {
    log.error('createMember() :: Failed to create new member', {
      error: ex,
      custom: logCustom,
    });
    throw ex;
  }

  const localMember = await getById(guildMember.user.id);

  return localMember;
};
