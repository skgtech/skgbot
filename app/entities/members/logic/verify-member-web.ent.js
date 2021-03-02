/**
 * @fileoverview Handle member verification requests.
 */

const { validate: uuidValidate } = require('uuid');

const { getById } = require('../sql/members.sql');
const { render } = require('../templates/verify-member.tpl');
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
    log.warn('Bogus member id provided for token verification', {
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
    log.warn(`_verifyMember() :: Could not locate member with id ${memberId}`);
    return entity._failPage();
  }

  if (!entity.verifyMemberToken(localMember, token)) {
    log.info('_verifyMember() Verification failed for member', { localMember });
    return entity._failPage();
  }
};

/**
 * Return a rendered failed page to show to the end user.
 *
 * @return {string} Rendered HTML page.
 * @private
 */
entity._failPage = () =>
  render('Operation Failed', 'Please check with SKGBot or contact an admin.');
