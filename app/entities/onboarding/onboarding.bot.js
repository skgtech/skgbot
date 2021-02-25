/**
 * @fileoverview Onboarding of Discord users.
 */

const discordService = require('../../services/discord.service');

const onboarding = (module.exports = {});

onboarding.init = () => {
  const client = discordService.getClient();

  // Create an event listener for new guild members
  client.on('guildMemberAdd', (member) => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.cache.find(
      (ch) => ch.name === 'member-log',
    );

    // Do nothing if the channel wasn't found on this server
    if (!channel) {
      return;
    }

    // Send the message, mentioning the member
    channel.send(`Welcome to the server, ${member}`);
  });
};
