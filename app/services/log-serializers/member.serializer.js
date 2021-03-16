/**
 * Serializes the local member record.
 *
 * @param {string=} usePath Set to override default log write path.
 * @return {function} Serializer for logality.
 */
module.exports = (usePath = 'context.localMember') => {
  return (value) => {
    return {
      path: usePath,
      value: {
        discord_uid: value.discord_uid,
        username: value.username,
        nickname: value.nickname,
        onboarding_state: value.onboarding_state,
      },
    };
  };
};
