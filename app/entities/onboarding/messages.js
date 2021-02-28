/**
 * @fileoverview Messages dispatched during the onboarding process.
 */

const messages = (module.exports = {});

messages.welcome = (guildMember) => `Hello! Welcome ${guildMember}

and there you go.`;

messages.cannotUnderstandYou = () =>
  'I am sorry, I did not undestand you.' +
  ' Please type `!help` for a list of commands';

messages.alreadyRegistered = () =>
  'You are already registered. If you want' +
  ' to go through onboarding again, type the command !reset-onboarding';

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

messages.step4Error = () =>
  'Please type a proper email, max characters are 60.';

messages.step4Success = (email) =>
  `"${email}", got it! Now I need your bio.\n\nFeel free to add newlines and ` +
  'links pointing to your public profile[s].\n\nThe idea is to let other' +
  ' members know more about you, your profession, expertise and interests.' +
  '\n\nYou may type up to 5 newlines and a total of 350 characters.';

messages.step5Error = () =>
  'Please write a proper bio. You may type up to 5 newlines and a max of 350 ' +
  'charcets.';

messages.step5Success = () =>
  'Thank you for your bio, now the last thing I need from you is how you want' +
  ' to be visible in this server.\n\nChoose your nickname:';

messages.step6Error = () =>
  'Please write a nickname. Do not use newlines, only use latin (english) ' +
  'characters, max characters are 32.';

messages.step6Success = (nickname) =>
  `Got it ${nickname}!\n\nYou now have to check your mail application and` +
  ' verify your email.';

messages.onboardingSubject = () => 'Please verify your email for SKGTech';

messages.onboardingEmail = (firstName, verificationCode) =>
  `Hello ${firstName}!

Thank you for registering at SKGTech's Discord Server.

To get into the server, you may copy & paste the code bellow to our bot:

${verificationCode}

or just click the link bellow:

https://verify.skgtech.io/verify/${verificationCode}

(you may need to copy and paste the above address into your browser).

Looking forward to chatting with you!
Beep bop!

`;
