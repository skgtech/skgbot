/**
 * @fileoverview Checks what international observed date it is today.
 */

const format = require('date-fns/format');

const intlDays = require('../international-days');

const entity = (module.exports = {});

/**
 * Collates various news sources to produce the daily brief.
 *
 * @return {string} Formatted message to return.
 */
entity.getIntlDay = () => {
  const nowDt = new Date();
  const dateStr = format(nowDt, 'dd/LL');

  const output = [];

  output.push('International Observances for today:');

  intlDays.forEach(([day, observance]) => {
    if (day === dateStr) {
      output.push(`* ${observance}`);
    }
  });

  const outStr = output.join('\n');
  return outStr;
};
