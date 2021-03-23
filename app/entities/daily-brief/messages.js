/**
 * @fileoverview Messages for the daily brief.
 */

const messages = (module.exports = {});

messages.goodmorning = (dateStr) => `🤖 Blip Blop, this is your Daily Brief 🤖

📆 **${dateStr}**
`;

messages.intlDayTitle = () => `**Today we Observe Internationally**`;

messages.intlDayMessage = (observance) => `* ${observance}`;

messages.greekNamedayMessage = (greekNameday) => `
**Σήμερα γιορτάζουν**
${greekNameday}.`;

messages.jokeMessage = ({ setup, punchline }) => `
**Joke of the day**
- ${setup}
- ${punchline}`;

messages.finalTip = () => `
**Pro Tip** :`;

messages.proTips = () => [
  `Send me a private message with \`!help\` to unlock SKGTech!`,
  `You can check a member's profile if you message me \`!profile nickname\``,
  `You can hack the status to include your prolile. Click on your avatar at` +
    ` the bottom left of your Discord Client, and then click the "Custom Status"`,
  `You can connect and share your social media if you go to the bottom left cog` +
    ` "User Settings" --> "Connections".`,
  `If a channel does not interest you or is too loud for you, you can right` +
    ` click and "Mute Channel" it.`,
  `Tweak your notification settings: Click on "#SKGTech" at the top left, then` +
    `"Notification Settings" and set the appropriate settings for your likings.` +
    ` Check this message https://discord.com/channels/811498668167397416/814452021783560193/817394293714059274`,
  `You can invite your friends using the permalink in the #rules channel.` +
    ` You can find the same link on the https://skgtech.io website. Here it` +
    ` is for your convenience: https://discord.gg/BtyMYpDacK`,
  `If you have a company abroad and need to discuss tax issues, message` +
    ` a moderator to invite you to the relevant channel 🤫.`,
];
