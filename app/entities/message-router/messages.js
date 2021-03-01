/**
 * @fileoverview Messages needed for command router.
 */

const messages = (module.exports = {});

messages.help = () => 'HELP!!!';
messages.helpOnboarding = () => 'HELP Onboarding!!!';
messages.error = () =>
  'Unknown command, type `!help` for a list of available commands.';
messages.cannotFindYou = (username) =>
  `Hey ${username}, I don't seem to have,` +
  ' a record of you, have you joined the SKGTech discord server?';
