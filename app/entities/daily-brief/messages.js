/**
 * @fileoverview Messages for the daily brief.
 */

const messages = (module.exports = {});

messages.goodmorning = (dateStr) => `🤖 Blip Blop, this is your Daily Brief 🤖
📆 **${dateStr}**
`;

messages.greekNamedayMessage = (greekNameday) =>
  `Σήμερα γιορτάζουν: ${greekNameday}.`;
