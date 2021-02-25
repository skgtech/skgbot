/**
 * @fileoverview Simulates joins and parts from the server.
 */

const Commando = require('discord.js-commando');

module.exports = class SimJoinCommand extends Commando.Command {
  constructor(client) {
    const opts = {
      name: 'simjoin',
      group: 'testing',
      memberName: 'simjoin',
      userPermissions: ['ADMINISTRATOR'],
      description: 'simulates join',
    };
    super(client, opts);
  }

  run(message) {
    this.client.emit('guildMemberAdd', message.member);
  }
};
