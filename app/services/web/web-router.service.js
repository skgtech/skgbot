/**
 * @fileoverview The Web Router.
 */

const { health } = require('../../entities/health-check/health-check.ctrl');
const { verifyMember } = require('../../entities/members');

const router = (module.exports = {});

/**
 * Setup available routes.
 *
 * @param {Express} app The express instance.
 */
router.setup = (app) => {
  app.get('/health', health);
  app.get('/verify/:token', verifyMember);
};
