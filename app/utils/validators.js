/**
 * @fileoverview Various validators for data input.
 */

const valid = (module.exports = {});

/** @type {RegExp} Regexp for validating name type input */
valid.RE_NAME = /^[\w\-\s]+$/;

/**
 * Checks if a string passes first or last name validations.
 *
 * @param {string} name The name to validate (first or last)
 * @return {boolean} if it passes validations.
 */
valid.isName = (name) => {
  return !!valid.RE_NAME.test(name);
};
