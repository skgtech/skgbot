/**
 * @fileoverview Change the bio of a user.
 */

const memberSql = require('../sql/members.sql');
const { bioChanged, bioChangeFail, bioInvalid } = require('../messages');
const log = require('../../../services/log.service').get();

const entity = (module.exports = {});

/**
 * Show a member's profile from the data store.
 *
 * @param {DiscordMessage} message The incoming message.
 * @param {Member} localMember The fetched local member.
 * @param {string} newBio New bio.
 * @return {Promise<void>}
 */
entity.changeBio = async (message, localMember, newBio) => {
  log.info(`Member changing their bio`, {
    localMember,
    custom: {
      old_bio: localMember.bio,
      new_bio: newBio,
    },
  });

  if (!entity.validateBio(newBio)) {
    message.channel.send(bioInvalid());
    return;
  }

  try {
    await memberSql.update(localMember.discord_uid, { bio: newBio });
  } catch (ex) {
    log.error('Error while changing nickname for member', {
      localMember,
      error: ex,
    });

    await message.channel.send(bioChangeFail());
    return;
  }

  message.channel.send(bioChanged(newBio));
};

/**
 * Validates the bio of a member.
 *
 * @param {string} bio The bio to validate.
 * @return {boolean} True if it passes validation.
 */
entity.validateBio = (bio) => {
  const newlineCount = (bio.match(/\n/g) || []).length;

  if (newlineCount > 5) {
    return false;
  }

  if (bio.length > 350) {
    return false;
  }

  return true;
};
