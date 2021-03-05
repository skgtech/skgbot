/**
 * @fileoverview Topic categories helpers.
 */

const config = require('config');

const { categoryInvalid } = require('./messages');

const entity = (module.exports = {});

/**
 * Sanitizes, validates and returns canonical category name.
 *
 * Combines all methods bellow.
 *
 * @param {DiscordMessage} message The incoming private message.
 * @param {string} categoryRaw The category raw membber input.
 * @param {boolean=} notifyClient Set to false to not notify client.
 * @return {sring|boolean} Canonical category name or false if invalud.
 */
entity.sanitizeAndValidate = async (
  message,
  categoryRaw,
  notifyClient = true,
) => {
  const category = entity.sanitize(categoryRaw);
  if (!entity.validateCategory(category)) {
    if (notifyClient) {
      await message.channel.send(categoryInvalid());
    }
    return false;
  }
  // Get the actual string literal of the category name
  const canonicalCategory = entity.getCanonical(category);

  return canonicalCategory;
};

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
 * @param {string} categoryRaw The category raw membber input.
 * @return {string} sanitized category.
 */
entity.sanitize = (categoryRaw) => {
  return categoryRaw.trim().toLowerCase();
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
