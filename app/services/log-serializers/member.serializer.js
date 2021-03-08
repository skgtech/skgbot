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
        email: value.email,
        username: value.username,
        nickname: value.nickname,
        first_name: value.first_name,
        last_name: value.last_name,
        onboarding_state: value.onboarding_state,
        joined_at: value.joined_at,
        left_at: value.left_at,
      },
    };
  };
};
