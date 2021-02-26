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

messages.step2Error = () =>
  'Please write a proper name, without newlines using latin (english) ' +
  'characters, max characters are 20.';

messages.step2Success = (firstName) =>
  `Thank you ${firstName}, now please let us know, what is your last name?`;

messages.step3Error = () =>
  'Please write a proper name, without newlines using latin (english) ' +
  'characters, max characters are 30.';

messages.step3Success = (lastName) =>
  `"${lastName}", got it! Now can I please have your email?`;
