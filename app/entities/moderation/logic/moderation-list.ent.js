/**
 * @fileoverview Will list all applied bans for a specific member.
 */

const _ = require('lodash');
const formatDate = require('date-fns/format');

const { asyncMapCap } = require('../../../utils/helpers');
const { getByMemberId } = require('../sql/moderation.sql');
const { getById: memberGetById } = require('../../members');
const { failed } = require('../messages');
const log = require('../../../services/log.service').get();

const entity = (module.exports = {});

/**
 * Will list all applied bans for a specific member.
 *
 * Access Control has already been performed.
 *
 * @param {DiscordMessage} message incoming private discord message.
 * @param {Member} localMember The local member.
 * @return {Promise<void>} A Promise.
 */
entity.moderationList = async (message, localMember) => {
  const [, memberDiscordId] = message.content.split(' ');

  try {
    const allRecords = await getByMemberId(memberDiscordId);

    const formattedMessage = await entity._formatMessage(
      memberDiscordId,
      allRecords,
    );
    await message.channel.send(formattedMessage);
  } catch (ex) {
    await message.channel.send(failed());
    await log.error('moderationBan() Failed', {
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
    message = 'No ban records found for that member';
    return message;
  }

  // see if we can fetch a member record for the target member listing the bans.
  const localMember = await memberGetById(memberDiscordId);

  if (localMember) {
    message += `Member "${localMember.nickname}" <${localMember.email}>,``"${localMember.first_name} ${localMember.last_name}" bans:`;
  }

  // Fetch banning Moderator records
  const moderatorsAr = [];
  allRecords.forEach((banRecord) => {
    if (!moderatorsAr.includes(banRecord.discord_uid)) {
      moderatorsAr.push(banRecord.discord_uid);
    }
  });

  const moderatorRecords = await asyncMapCap(moderatorsAr, async (modId) => {
    return memberGetById(modId);
  });

  message += allRecords.map((banRecord) => {
    const dt = new Date(banRecord.created_at);
    const dtStr = formatDate(dt, 'dd/LLL/yyyy HH:mm');
    const modRecord = _.find(moderatorRecords, [
      'discord_uid',
      banRecord.moderator_discord_uid,
    ]);
    return `\n * [${dtStr}] "${banRecord.category}" by ${modRecord.nickname}`;
  });

  return message;
};
