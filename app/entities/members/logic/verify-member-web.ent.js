/**
 * @fileoverview Handle member verification requests.
 */

const { validate: uuidValidate } = require('uuid');

const { canOnboard } = require('../../moderation');
const { getGuildMemberLocal, applyRoles } = require('../../discord');
const { getById } = require('../sql/members.sql');
const { enableMember } = require('./enable-member.ent');
const { render } = require('../templates/verify-member.tpl');
const { step7Success, cannotOnboard } = require('../../onboarding/messages');
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
entity.verifyMember = async (req, res, next) => {
  try {
    const response = await entity._verifyMember(req.params.token);
    res.send(response);
  } catch (ex) {
    next(ex);
  }
};

/**
 * Validates the given token against the provided local member.
 *
 * @param {Member} localMember The fetched local member.
 * @param {string} token The token to validate.
 * @return {boolean} If it passes validation.
 */
entity.verifyMemberToken = async (localMember, token) => {
  const [memberId, uuidToken] = token.split('_');

  if (memberId !== localMember.discord_uid) {
    await log.warn('Bogus member id provided for token verification', {
      localMember,
      custom: {
        member_id_provided: memberId,
      },
    });
    return false;
  }

  if (!uuidValidate(uuidToken)) {
    return false;
  }

  // Check if verification token matches the one on record.
  if (uuidToken !== localMember.verification_code) {
    return false;
  }

  // Check if verification token has expired.
  const nowDt = new Date();
  const expireDt = new Date(localMember.verification_code_expires_at);
  if (nowDt > expireDt) {
    return false;
  }

  return true;
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
  const [memberId] = token.split('_');

  const localMember = await getById(memberId);

  if (!localMember) {
    await log.warn(
      `_verifyMember() :: Could not locate member with id ${memberId}`,
    );
    return entity._failPage();
  }

  if (localMember.is_onboarded) {
    return entity._alreadyVerifiedPage();
  }

  const guildMember = await getGuildMemberLocal(localMember);

  const memberCanOnboard = await canOnboard(localMember);
  if (!memberCanOnboard) {
    await guildMember.send(cannotOnboard());
    return entity._failPage();
  }

  if (!entity.verifyMemberToken(localMember, token)) {
    log.info('_verifyMember() Verification failed for member', { localMember });
    return entity._failPage();
  }

  // Checks out, member has verified, activate them.
  await log.info('User verified via web, joins server', {
    localMember,
    relay: true,
    emoji: ':ballot_box_with_check: :computer:',
  });

  await guildMember.send(step7Success());
  await applyRoles(guildMember);
  await enableMember(localMember);
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
  render('Operation Failed', 'Please check with SKGBot or contact an admin.');

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
