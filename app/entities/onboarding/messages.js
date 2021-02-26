/**
 * @fileoverview Messages dispatched during the onboarding process.
 */

const messages = (module.exports = {});

messages.welcome = (guildMember) => `Hello! Welcome ${guildMember}

and there you go.`;

messages.cannotUnderstandYou = () =>
  'I am sorry, I did not undestand you.' +
  ' Please type `!help` for a list of commands';

messages.step1Error = () =>
  'I am sorry, at this point you may only reply with a `yes`';

messages.step1Success = () =>
  'That is great! Let get started, what is your first name?';
