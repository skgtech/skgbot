/**
 * @fileoverview Collates various news sources to produce the
 *   daily brief.
 */

const format = require('date-fns/format');

const { goodmorning } = require('./messages');
const { getIntlDay } = require('./logic/international-day.ent');
const log = require('../../services/log.service').get();

const entity = (module.exports = {});

/**
 * Collates various news sources to produce the daily brief.
 *
 * @return {Promise<void>} A Promise.
 */
entity.dailyBrief = async () => {
  const nowDt = new Date();
  const dateStr = format(nowDt, 'eeee, eo of LLLL uuuu');

  const output = [];

  output.push(goodmorning(dateStr));
  const intlDay = getIntlDay();
};
