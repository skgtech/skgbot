/**
 * @fileoverview Handle member verification request via web.
 */

const discordHelper = require('../../discord');
const { getById } = require('../../members');
const { render } = require('../templates/verify-member.tpl');
const { step7Success, cannotOnboard } = require('../messages');
const {
  verifyMemberToken,
  enableMember,
  canOnboard,
} = require('./verification.ent');
const log = require('../../../services/log.service').get();

const entity = (module.exports = {});

/**
 * Express Controller for handling user verification requests.
 *
 * @param {Request} req Express request.
 * @param {Response} res Express response.
 * @param {function} next Error handler.
 * @return {Promise} A Promise.
 */
entity.verifyMemberWeb = async (req, res, next) => {
  try {
    const response = await entity._verifyMember(req.params.token);
    res.send(response);
  } catch (ex) {
    next(ex);
  }
};

/**
 * Handles member verification web request.
 *
 *  1. Checks if token is valid.
 *  2. Provides appropriate, HTML rendered, response.
 *
 * @param {string} token Client's token to verify a member against.
 * @return {Promise<string>} A Promise with the rendered HTML response.
 * @private
 */
entity._verifyMember = async (token) => {
  const localMember = await entity._fetchLocalMember(token);

  if (!localMember) {
    return entity._failPage();
  }

  // Token verifications and validations.
  const verified = verifyMemberToken(localMember, token);
  if (!verified) {
    return entity._failPage();
  }

  const guildMember = await discordHelper.getGuildMemberLocal(localMember);

  // Check moderation or any other restrictions
  const memberCanOnboard = await canOnboard(localMember);
  if (!memberCanOnboard) {
    await guildMember.send(cannotOnboard());
    return entity._failPage();
  }

  // Everything checks out, allow the member in.
  await enableMember(guildMember, localMember);

  // Checks out, member has verified, activate them.
  await log.info('User verified via web, joins server', {
    localMember,
    relay: true,
    emoji: ':ballot_box_with_check: :computer:',
  });

  await guildMember.send(step7Success());

  const response = render(
    'You are now Verified!',
    'Go back to discord and check the message you received from SKGBot',
  );

  return response;
};

/**
 * Return a rendered failed page to show to the end user.
 *
 * @return {string} Rendered HTML page.
 * @private
 */
entity._failPage = () =>
  render(
    'Operation Failed',
    'Please check with SKGBot or contact a Moderator.',
  );

/**
 * Return a rendered failed page to show that the member has already verified.
 *
 * @return {string} Rendered HTML page.
 * @private
 */
entity._alreadyVerifiedPage = () =>
  render(
    'Already Verified',
    'You have already verified, check your discord client',
  );

/**
 * Will attempt to resolve the localmember from the discord_uid that should be
 * as a part in the provided token.
 *
 * @param {string} token Client's token to verify a member against.
 * @return {Promise<Member|null>} A Promise with the local member, null if not
 *    found.
 * @private
 */
entity._fetchLocalMember = async (token) => {
  const [memberId] = token.split('_');
  const localMember = await getById(memberId);
  if (!localMember) {
    await log.warn(
      `_verifyMember() :: Could not locate member with id ${memberId}`,
      {
        custom: {
          token,
        },
      },
    );
    return null;
  }

  return localMember;
};
