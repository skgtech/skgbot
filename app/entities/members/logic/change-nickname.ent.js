/**
 * @fileoverview Change the nickname of a user.
 */
const validator = require('validator');

const memberSql = require('../sql/members.sql');
const {
  nicknameChanged,
  nicknameChangeFail,
  nicknameInvalid,
} = require('../messages');
const log = require('../../../services/log.service').get();

const entity = (module.exports = {});

/**
 * Show a member's profile from the data store.
 *
 * @param {DiscordMessage} message The incoming message.
 * @param {Member} localMember The fetched local member.
 * @param {string} nickname The nickname to change to.
 * @return {Promise<void>}
 */
entity.changeNickname = async (message, localMember, nickname) => {
  log.info(
    `Member changing their nickname from "${localMember.nickname}"` +
      `to "${nickname}"`,
    { localMember, relay: true },
  );

  if (!entity.validateEmail(nickname)) {
    message.channel.send(nicknameInvalid());
    return;
  }

  try {
    await memberSql.update(localMember.discord_uid, { nickname });
  } catch (ex) {
    log.error('Error while changing nickname for member', {
      localMember,
      error: ex,
    });

    await message.channel.send(nicknameChangeFail());
    return;
  }

  message.channel.send(nicknameChanged(nickname));
};

/**
 * Validates a nickname.
 *
 * @param {string} nickname The new nickname to validate.
 * @return {boolean} True if it passes validation.
 */
entity.validateEmail = (nickname) => {
  const seed = '-abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (validator.contains(nickname, seed)) {
    return false;
  }

  if (nickname.length > 32) {
    return false;
  }

  return true;
};
