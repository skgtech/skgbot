/**
 * @fileoverview Collates various news sources to produce the
 *   daily brief.
 */

const format = require('date-fns/format');

const discordEnt = require('../discord');
const {
  finalTip,
  goodmorning,
  greekNamedayMessage,
  jokeMessage,
} = require('./messages');
const { getDadJoke } = require('./logic/dad-joke.ent');
const { getIntlDay } = require('./logic/international-day.ent');
const { getGreekNameday } = require('./logic/international-day.ent');
const log = require('../../services/log.service').get();

const entity = (module.exports = {});

/**
 * Collates various news sources to produce the daily brief.
 *
 * @return {Promise<void>} A Promise.
 */
entity.dailyBrief = async () => {
  log.info('Starting daily brief...');
  const nowDt = new Date();
  const dateStr = format(nowDt, 'eeee, eo of LLLL uuuu');

  const output = [];

  output.push(goodmorning(dateStr));
  const intlDay = getIntlDay();
  if (intlDay) {
    output.push(intlDay);
  }

  const greekNameday = await getGreekNameday();
  if (greekNameday) {
    output.push(greekNamedayMessage(greekNameday));
  }

  const joke = await getDadJoke();
  if (joke) {
    output.push(jokeMessage(joke));
  }

  output.push(finalTip);

  const outputMessage = output.join('\n');
  const mainChannel = discordEnt.getMainChannel();
  await mainChannel.send(outputMessage);
};
