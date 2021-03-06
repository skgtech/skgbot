/**
 * @fileoverview Messages needed for command router.
 */

const messages = (module.exports = {});

messages.help = () =>
  `Available commands to members:

* \`!help\` :: This help screen.
* \`!profile [username]\` :: Show the profile of another member.
* \`!nickname [nickname]\` :: Update your nickname.
* \`!bio [bio]\` :: Update your bio, multi-line inputs are allowed.
* \`!join [Category]\` :: Join a topic category of channels (more below).
* \`!part [Category]\` :: Leave a topic category of channels (more below).

Available topic Categories in this server:

* \`Engineer\` Engineering topics, programming languages, devops, etc.
* \`Product\` Product, design, remote, business and leadership topics.
* \`Hobbies\` Real-life hobbies, movies, music, space, IoT, gardening, etc.
* \`Investor\` Channels related to investing and cryptos.
* \`Politics\` Politics and Pandemic related channels.
* \`Sports\` Sports related channels.
* \`Space\` Add this category if you want to be notified of space events` +
  `(launches, live events, etc).`;

messages.helpMods = () =>
  `\n\n**Moderators Help**

You need to enable "developer mode" on discord in order to view the IDs of users.

To do that: Open your Discord settings (the next to your name at the bottom` +
  ` left) and click on Appearance. There you will find Developer Mode. Click the` +
  ` toggle to enable it.

* \`!ban [discord_member_id] [Category] [reason]\` Ban a member from joining` +
  ` the \`[Category]\`. Use \`*\` to force them to be only in the welcome` +
  ` channel. **NOTE**: the \`[Category]\` field is case insensitive.
* \`!unban [discord_member_id] [Category]\` Remove a particular ban of that` +
  ` member with the specific \`[Category]\`
* \`!banlist [discord_member_id]\` Get a list of bans for that member.
* \`!banlistall\` Get all bans on the bot.
`;

messages.helpOnboarding = () => `Available commands for onboarding:

* \`!help\` :: This help screen.
* \`!reset\` ::  Reset the onboarding process and start over.
* \`!resend\` :: Resend the verification email.`;

messages.helpOnboarding = () => `Available commands for onboarding:

* \`!help\` :: This help screen.
* \`!reset\` :: Restart the onboarding process.
* \`!resend\` :: Resend the verification email.`;
messages.error = () =>
  'Unknown command, type `!help` for a list of available commands.';
messages.cannotFindYou = (username) =>
  `Hey ${username}, I don't seem to have,` +
  ' a record of you, have you joined the SKGTech discord server?';
