/**
 * @fileoverview Topic categories helpers.
 */

const config = require('config');

const entity = (module.exports = {});

/**
 * Validates a category.
 *
 * @param {string} category The category to validate.
 * @return {boolean} True if it passes validation.
 */
entity.validateCategory = (category) => {
  return config.discord.roles_all_available_lowercase.includes(category);
};

/**
 * Sanitizes the raw input into a lowercased, trimmed category name.
 *
 * @param {string} cmdArgument Raw input of user.
 * @return {string} sanitized category.
 */
entity.sanitize = (cmdArgument) => {
  return cmdArgument.trim().toLowerCase();
};

/**
 * Returns the canonical name of the category. In order to properly validate
 * and handle user case-insensitive inputs, we have two arrays of roles in the
 * config:
 *
 * * config.discord.roles_all_available - CANONICAL
 * * config.discord.roles_all_available_lowercase - LOWERCASED
 *
 * This function, resolves the lowercased role to the canonical name.
 *
 * @param {string} category Lowercased category name.
 * @return {string} Canonical category name.
 */
entity.getCanonical = (category) => {
  const index = config.discord.roles_all_available_lowercase.findIndex(
    (item) => item === category,
  );

  return config.discord.roles_all_available[index];
};
