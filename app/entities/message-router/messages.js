/**
 * @fileoverview Messages needed for command router.
 */

const messages = (module.exports = {});

messages.help = () => `Available commands to members:

* \`!help\` :: This help screen.
* \`!profile [username]\` Show the profile of another member.
* \`!nickname [nickname]\` Update your nickname.
* \`!bio [bio]\` Update your bio, multi-line inputs are allowed.
* \`!join [Category]\` Join a topic category of channels (more bellow).
* \`!part [Category]\` Leave a topic category of channels (more bellow).

Available topic Categories in this server:

* \`Engineer\` Engineering topics, programming languages, devops, etc.
* \`Product\` Product, design, remote, business and leadership topics.
* \`Hobbies\` Real-life hobbies, movies, music, space, IoT, gardening, etc.
* \`Investor\` Channels related to investing and cryptos.
* \`Politics\` Politics and Pandemic related channels.`;

messages.helpOnboarding = () => 'HELP Onboarding!!!';
messages.error = () =>
  'Unknown command, type `!help` for a list of available commands.';
messages.cannotFindYou = (username) =>
  `Hey ${username}, I don't seem to have,` +
  ' a record of you, have you joined the SKGTech discord server?';
