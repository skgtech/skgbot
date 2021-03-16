/**
 * @fileoverview Messages for the daily brief.
 */

const messages = (module.exports = {});

messages.goodmorning = (dateStr) => `🤖 Blip Blop, this is your Daily Brief 🤖
📆 **${dateStr}**
`;

messages.greekNamedayMessage = (greekNameday) =>
  `Σήμερα γιορτάζουν: ${greekNameday}.`;

messages.jokeMessage = ({ setup, punchline }) => `**Joke of the day**
- ${setup}
- ${punchline}`;

messages.finalTip = () => `

**Pro Tip**: Send me a private message with \`!help\` to unlock SKGTech!`;
