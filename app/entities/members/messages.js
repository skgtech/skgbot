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

messages.showProfileAdmin = (member) => `**Moderator Extra Profile View**
Email: ${member.email}
Joined At: ${member.joined_at}
Is Onboarded: ${member.is_onboarded}
Onboardet At: ${member.onboarded_at}
Onboarding State: ${member.onboarding_state}
`;

messages.nicknameChanged = (nickname) => `Your nickname is now ${nickname}!`;

messages.nicknameChangeFail = () =>
  'Failed to update your nickname... Maybe it is already taken?';
messages.nicknameInvalid = () => `${step6Error()}`;

messages.bioChanged = (bio) => `Your Bio has now changed to:
${bio}`;
messages.bioChangeFail = () => 'I am sorry, I could not update your bio';
messages.bioInvalid = () => `${step5Error()}`;

messages.cannotJoin = (category) =>
  `You are not allowed to join category ${category}`;
messages.categoryJoined = (category) =>
  `You joined the topic category "${category}"`;
messages.categoryParted = (category) =>
  `You have parted the topic category "${category}"`;
messages.categoryInvalid = () =>
  `Invalid topic category. Type \`!help\` for` +
  ` a list of available categories.`;

messages.alreadyJoined = (category) => `You are already joined to ${category}`;
messages.alreadyParted = (category) =>
  `You are not in the ${category} category`;
messages.failed = () =>
  "I am sorry, something went wront. It's me, not you," +
  ' the admins have been notified.';
