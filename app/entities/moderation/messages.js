/**
 * @fileoverview Messages needed for moderation entity.
 */

const { failed } = require('../members/messages');

const messages = (module.exports = {});

messages.failed = () => `${failed()}`;
