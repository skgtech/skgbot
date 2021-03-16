/**
 * @fileoverview Fetches and formats the Greek nameday celebration of today.
 */

const axios = require('axios');
const xml2js = require('xml2js');

const log = require('../../../services/log.service').get();

const entity = (module.exports = {});

/**
 * Fetches and formats the Greek nameday celebration of today.
 *
 * Results are fetched from http://www.eortologio.gr
 *
 * @return {Promise<string|null>} A Promise with the nameday or null if error or
 *   no results.
 * @see http://www.eortologio.gr/rss/si_el.xml
 */
entity.getGreekNameday = async () => {
  try {
    const axiosRes = await axios({
      method: 'get',
      url: 'http://www.eortologio.gr/rss/si_el.xml',
    });
    const parser = new xml2js.Parser(/* options */);
    const xmlRes = await parser.parseStringPromise(axiosRes.data);

    if (xmlRes?.rss?.channel[0]?.item[0].title) {
      const namedayRaw = xmlRes.rss.channel[0].item[0].title[0];
      if (typeof namedayRaw === 'string' && namedayRaw.length) {
        const [, nameday] = namedayRaw.split(': ');
        return nameday;
      }
    }
    return null;
  } catch (ex) {
    await log.error('getGreeknameday() failed', { error: ex });
    return null;
  }
};
