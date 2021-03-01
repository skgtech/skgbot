/**
 * @fileoverview Messages needed for members entity.
 */

const messages = (module.exports = {});

messages.cannotFindMember = () =>
  'Could not find the member you are looking for.';

messages.showProfile = (member) => `Nickname: ${member.nickname}
Full Name: ${member.first_name} ${member.last_name}
Bio: ${member.bio}`;
