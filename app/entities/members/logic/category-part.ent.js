/**
 * @fileoverview Part a topic category.
 */

const { sanitizeAndValidate } = require('../../categories');
const { categoryParted, alreadyParted, failed } = require('../messages');
const { removeRole } = require('../../discord');
const log = require('../../../services/log.service').get();

const entity = (module.exports = {});

/**
 * Part a topic category.
 *
 * @param {DiscordMessage} message The incoming message.
 * @param {Member} localMember The fetched local member.
 * @param {string} categoryRaw User input for category to join.
 * @return {Promise<void>} A Promise.
 */
entity.categoryPart = async (message, localMember, categoryRaw) => {
  await log.info(`Member wants to part category: "${categoryRaw}"`, {
    localMember,
    relay: true,
    emoji: ':thumbsdown:',
  });

  const category = await sanitizeAndValidate(categoryRaw);
  // Invalid category, client informed.
  if (!category) {
    return;
  }

  try {
    const didNotHaveRole = await removeRole(localMember.discord_uid, category);
    if (!didNotHaveRole) {
      await message.channel.send(alreadyParted(category));
    } else {
      await message.channel.send(categoryParted(category));
    }
  } catch (ex) {
    await log.error('categoryPart() :: Failed to remove role', {
      localMember,
      error: ex,
      custom: {
        category,
      },
    });
    await message.channel.send(failed());
  }
};
