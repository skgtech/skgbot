/**
 * @fileoverview Will list all applied bans for any member (full list).
 */

const _ = require('lodash');
const formatDate = require('date-fns/format');

const { asyncMapCap } = require('../../../utils/helpers');
const { getAll } = require('../sql/moderation.sql');
const { getById: memberGetById } = require('../../members');
const { failed } = require('../messages');
const log = require('../../../services/log.service').get();

const entity = (module.exports = {});

/**
 * Will list all applied bans for any member (full list).
 *
 * Access Control has already been performed.
 *
 * @param {DiscordMessage} message incoming private discord message.
 * @param {Member} localMember The local member.
 * @return {Promise<void>} A Promise.
 */
entity.moderationListAll = async (message, localMember) => {
  try {
    const allRecords = await getAll();

    const formattedMessage = await entity._formatMessage(allRecords);
    await message.channel.send(formattedMessage);
  } catch (ex) {
    await message.channel.send(failed());
    await log.error('moderationListAll() Failed', {
      error: ex,
      localMember,
    });
  }
};

/**
 * Will format the response message to the moderator.
 *
 * @param {string} memberDiscordId The discord id of the target user.
 * @param {Array.<Object>} allRecords All relevant records for that member.
 * @return {Promise<string>} A Promise with a formatted message to be returned
 *    to the moderator.
 */
entity._formatMessage = async (memberDiscordId, allRecords) => {
  let message = '';
  if (allRecords.length === 0) {
    message = 'No ban records found';
    return message;
  }

  // Fetch target member records
  const targetMemberIds = _.uniqBy(allRecords, 'discord_uid');
  const targetMemberRecords = await asyncMapCap(
    targetMemberIds,
    async (memberId) => {
      return memberGetById(memberId);
    },
  );

  // Fetch banning Moderator records, get unique Mod Ids first
  const moderatorsIds = _.uniqBy(allRecords, 'moderator_discord_uid');
  // Now query for all the unique IDs
  const moderatorRecords = await asyncMapCap(moderatorsIds, async (modId) => {
    return memberGetById(modId);
  });

  const messageAr = allRecords.map((banRecord) => {
    const dt = new Date(banRecord.created_at);
    const dtStr = formatDate(dt, 'dd/LLL/yyyy HH:mm');
    const targetRecord = _.find(targetMemberRecords, [
      'discord_uid',
      banRecord.discord_uid,
    ]);
    const modRecord = _.find(moderatorRecords, [
      'discord_uid',
      banRecord.moderator_discord_uid,
    ]);

    const targetMember =
      `"${targetRecord.nickname}" <${targetRecord.email}>` +
      ` "${targetRecord.first_name} ${targetRecord.last_name}"`;

    return (
      `* [${dtStr}] ${targetMember} "${banRecord.category}"` +
      ` by ${modRecord.nickname}`
    );
  });

  message = messageAr.join('\n');

  return message;
};
