/**
 * @fileoverview Messages needed for members entity.
 */

const { step5Error, step6Error } = require('../onboarding/messages');

const messages = (module.exports = {});

messages.cannotFindMember = () =>
  'Could not find the member you are looking for.';

messages.showProfile = (member) => `Nickname: ${member.nickname}
Full Name: ${member.first_name} ${member.last_name}
Bio: ${member.bio}`;

messages.nicknameChanged = (nickname) => `Your nickname is now ${nickname}!`;

messages.nicknameChangeFail = () =>
  'Failed to update your nickname... Maybe it is already taken?';
messages.nicknameInvalid = () => `${step6Error}`;

messages.bioChanged = (bio) => `Your Bio has now changed to:
${bio}`;
messages.bioChangeFail = () => 'I am sorry, I could not update your bio';
messages.bioInvalid = () => `${step5Error}`;

messages.categoryJoined = (category) =>
  `You can joined the topic category "${category}"`;
messages.categoryParted = (category) =>
  `You have parted the topic category "${category}"`;
messages.categoryInvalid = () =>
  `Invalid topic category. Type \`!help\` for` +
  ` a list of available categories.`;
