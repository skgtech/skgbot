/**
 * @fileoverview Simulate Join Command.
 */

const Commando = require('discord.js-commando');

const log = require('../../services/log.service').get();

module.exports = class SimJoinCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'simjoin',
      group: 'testing',
      memberName: 'simjoin',
      userPermissions: ['ADMINISTRATOR'],
      description: 'Simulates a join',
    });
  }

  run(message) {
    log.info('SimJoinCommand() Emulating a member server join...');
    this.client.emit('guildMemberAdd', message.member);
  }
};
