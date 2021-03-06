/**
 * @fileoverview Generic helpers
 */

const Bluebird = require('bluebird');

const helpers = (module.exports = {});

/**
 * Executes concurrently the Function "fn" against all the  items in the array.
 * Throttles of concurrency to 5.
 *
 * Use when multiple I/O operations need to be performed.
 *
 * @param {Array<*>} items Items.
 * @param {function(*): Promise<*>} fn Function to be applied on the array items.
 * @return {Promise<*>}
 */
helpers.asyncMapCap = (items, fn) =>
  Bluebird.map(items, fn, { concurrency: 5 });

/**
 * An async delay, to time sending messages.
 *
 * @param {number} seconds How many seconds to wait.
 * @return {Promise<void>}
 */
helpers.delay = (seconds) => {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
};
