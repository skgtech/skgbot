/**
 * @fileoverview Onboarding of Discord users.
 */

const log = require('../../services/log.service').get();

const discordService = require('../../services/discord.service');

const onboarding = (module.exports = {});

onboarding.init = () => {
  log.info('Initializing onboarding entity...');
  const client = discordService.getClient();

  // Create an event listener for new guild members
  client.on('guildMemberAdd', async (member) => {
    console.log('ADD:', member);
    if (!member) {
      return;
    }

    // Send the message to a designated channel on a server:
    // const channel = member.guild.channels.cache.find(
    //   (ch) => ch.name === 'bot-test',
    // );

    const channel = await member.createDM();

    // Do nothing if the channel wasn't found on this server
    if (!channel) {
      return;
    }

    // Send the message, mentioning the member
    await channel.send(`Welcome to the server, ${member}`);
  });

  client.on('message', (message) => {
    if (message.content === 'ayy') {
      message.channel.send('Ayy, lmao!');
    }
    if (message.content === 'wat') {
      message.channel.send('Say what?');
    }
    if (message.content === 'lol') {
      message.channel.send('roflmaotntpmp');
    }
  });
};
