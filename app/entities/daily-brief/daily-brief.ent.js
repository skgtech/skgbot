/**
 * @fileoverview Collates various news sources to produce the
 *   daily brief.
 */

const format = require('date-fns/format');

const discordEnt = require('../discord');
const {
  finalTip,
  proTips,
  goodmorning,
  greekNamedayMessage,
  intlDayTitle,
  intlDayMessage,
  jokeMessage,
} = require('./messages');
const { getDadJoke } = require('./logic/dad-joke.ent');
const { getIntlDay } = require('./logic/international-day.ent');
const { getRandomInt } = require('../../utils/helpers');
const { getGreekNameday } = require('./logic/greek-namedays.ent');
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
  const dateStr = format(nowDt, "eeee, do 'of' LLLL uuuu");
  const mainChannel = discordEnt.getMainChannel();

  // Good morning message
  await mainChannel.send(goodmorning(dateStr));

  // International day message
  const intlDays = getIntlDay();
  const intlDayMessages = [];

  if (intlDays) {
    intlDayMessages.push(intlDayTitle());
    intlDays.forEach((intlDay) => {
      intlDayMessages.push(intlDayMessage(intlDay));
    });
  }

  await mainChannel.send(intlDayMessages.join('\n'));

  // Greek name day message
  const greekNameday = await getGreekNameday();
  if (greekNameday) {
    await mainChannel.send(greekNamedayMessage(greekNameday));
  }

  // Joke of the day message
  const joke = await getDadJoke();
  if (joke) {
    await mainChannel.send(jokeMessage(joke));
  }

  // Final tip message
  const allTips = proTips();
  const randomIndex = getRandomInt(allTips.length);
  const finalProTip = `${finalTip()} ${allTips[randomIndex]}`;

  const embedMessage = await mainChannel.send(finalProTip);
  // Remove any embeds
  await embedMessage.suppressEmbeds(true);
};
