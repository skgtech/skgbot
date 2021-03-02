/**
 * @fileoverview Various validators for data input.
 */

const valid = (module.exports = {});

/** @type {RegExp} Regexp for validating name type input */
valid.RE_NAME = /^[\w\-\s]+$/;

/** @type {RegExp} Regexp for validating nickname type input */
valid.RE_NICKNAME = /^[\w-]+$/;

/**
 * Checks if a string passes first or last name validations.
 *
 * @param {string} name The name to validate (first or last)
 * @return {boolean} if it passes validations.
 */
valid.isName = (name) => {
  return !!valid.RE_NAME.test(name);
};

/**
 * Checks if a string passes nickname validations.
 *
 * @param {string} nickname The nickname to validate.
 * @return {boolean} if it passes validations.
 */
valid.isNickname = (nickname) => {
  return !!valid.RE_NICKNAME.test(nickname);
};

/**
 * Validates a nickname.
 *
 * @param {string} nickname The new nickname to validate.
 * @return {boolean} True if it passes validation.
 */
valid.validateNickname = (nickname) => {
  if (!valid.isNickname(nickname)) {
    return false;
  }

  if (nickname.length > 32) {
    return false;
  }

  return true;
};
