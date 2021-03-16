/**
 * @fileoverview Checks what international observed date it is today.
 */

const format = require('date-fns/format');

const intlDays = require('../international-days');

const entity = (module.exports = {});

/**
 * Checks what international observed date it is today.
 *
 * @return {string} Formatted message to return.
 */
entity.getIntlDay = () => {
  const nowDt = new Date();
  const dateStr = format(nowDt, 'dd/LL');

  const output = [];

  let found = false;
  intlDays.forEach(([day, observance]) => {
    if (day === dateStr) {
      found = true;
      output.push(observance);
    }
  });
  if (!found) {
    return null;
  }
  return output;
};
