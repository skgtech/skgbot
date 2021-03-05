/**
 * @fileoverview Messages needed for moderation entity.
 */

const { categoryInvalid } = require('../members/messages');

const messages = (module.exports = {});

messages.categoryInvalid = () => `${categoryInvalid()}`;
