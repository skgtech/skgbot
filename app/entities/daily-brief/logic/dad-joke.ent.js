/**
 * @fileoverview Fetches a random dad joke.
 */

const axios = require('axios');

const { getRandomInt } = require('../../../utils/helpers');
const log = require('../../../services/log.service').get();

const entity = (module.exports = {});

/**
 * Fetches a random dad joke.
 *
 * Results are fetched from https://www.fatherhood.gov/for-dads/dad-jokes
 *
 * @return {Promise<string|null>} A Promise with the nameday or null if error or
 *   no results.
 * @see https://www.fatherhood.gov/for-dads/dad-jokes
 */
entity.getDadJoke = async () => {
  try {
    const axiosRes = await axios({
      method: 'get',
      url: 'https://www.fatherhood.gov/jsonapi/node/dad_jokes',
      responseType: 'json',
    });

    if (!axiosRes?.data?.data) {
      return null;
    }

    const jokes = axiosRes.data.data;
    const randomIndex = getRandomInt(jokes.length);
    const selectedJoke = jokes[randomIndex];

    const ret = {
      setup: selectedJoke.attributes.field_joke_opener,
      punchline: selectedJoke.attributes.field_joke_response,
    };
    return ret;
  } catch (ex) {
    await log.error('getDadJoke() failed', { error: ex });
    return null;
  }
};
