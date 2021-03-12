/**
 * @fileoverview Change the nickname of a user.
 */

const memberSql = require('../sql/members.sql');
const { validateNickname } = require('../../../utils/validators');
const { setNickname } = require('../../discord');
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
  await log.info(
    `Member changing their nickname from "${localMember.nickname}"` +
      `to "${nickname}"`,
    {
      localMember,
      relay: true,
      emoji: ':nail_care:',
    },
  );

  if (!validateNickname(nickname)) {
    message.channel.send(nicknameInvalid());
    return;
  }

  try {
    const nicknameLower = nickname.toLocaleLowerCase();
    await memberSql.update(localMember.discord_uid, {
      nickname,
      nickname_lowercase: nicknameLower,
    });
  } catch (ex) {
    await log.error('Error while changing nickname for member', {
      localMember,
      error: ex,
    });

    await message.channel.send(nicknameChangeFail());
    return;
  }

  // Set the nickname on the discord server
  await setNickname(message, localMember, nickname);

  message.channel.send(nicknameChanged(nickname));
};
