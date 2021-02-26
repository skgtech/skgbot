/**
 * @fileoverview Messages needed for command router.
 */

const messages = (module.exports = {});

messages.help = () => 'HELP!!!';
messages.error = () =>
  'Unknown command, type `!help` for a list of available commands.';
