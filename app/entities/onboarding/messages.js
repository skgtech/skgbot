/**
 * @fileoverview Messages dispatched during the onboarding process.
 */

const config = require('config');

const { help: memberHelp } = require('../message-router/messages');

const messages = (module.exports = {});

const serverName = config.discord.server_name;

messages.welcome = (guildMember) =>
  `Hello ${guildMember}, Welcome to ${serverName}'s Discord Server!

We are a community of professionals passionate about technology.

Everyone can use their desired nickname, however, we do not allow anonymous` +
  ` accounts in this community. As such we'll kindly ask you for the` +
  ` following information to build your personal profile, that information` +
  ` will be available to everyone, except your email:

* Your Real Name.
* Your email for verification (will not be visible).
* Your Bio.
* Your Desired nickname.

If you agree with that, please type \`yes\` to get started!

Also, don't forget, I am a robot 🤖, so don't give me a hard time, if you ` +
  "encounter any problems, don't hesitate to contact an Admin. You can" +
  ' also type `!help` for a list of available commands.';

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
  ' to be visible in this server.\n\nType your nickname:';

messages.step6Error = () =>
  'Please write a nickname. Do not use newlines, only use latin (english) ' +
  'characters, max characters are 32.';

messages.step6Success = (nickname) =>
  `Got it ${nickname}!\n\nYou now have to check your mail application and` +
  ' verify your email. You may paste the verification token here or just click' +
  ' on the provided link in the email I sent you.\n\nMake sure you have' +
  ' checked your SPAM folder.';

messages.step7Error = () =>
  'Please paste the appropriate code you have received on your email.';

messages.step7Success = () =>
  `Thank you for verifying your email 🎉 and welcome to ${serverName}'s discord` +
  ` server! Find bellow a list of commands that are now available to you:\n\n` +
  `${memberHelp()}`;

messages.step7ErrorNoMatch = () =>
  'The verification code does not match, or' +
  'it has expired. Please type `!resend` to send a new email.';

messages.step7ErrorWrongState = () =>
  `You are not in the proper state for me` +
  ' to resend a verification email to you. If you believe this is in error' +
  ' please contant an administrator.';

messages.onboardingSubject = () => `Please verify your email for ${serverName}`;

messages.onboardingEmail = (firstName, verificationCode) =>
  `Hello ${firstName}!

Thank you for registering at ${serverName}'s Discord Server.

To get into the server, you may copy & paste the code bellow to our bot:

${verificationCode}

or just click the link bellow:

${config.onboarding.verification_url}${verificationCode}

(you may need to copy and paste the above address into your browser).

Looking forward to chatting with you!
Beep bop!

`;
