/**
 * @fileoverview Create initial data for starting the service.
 */

// const { v4: uuid } = require('uuid');

const seed = (module.exports = {});

/**
 * Create initial data for starting the service.
 *
 * @param {Object} knex Knex instance.
 * @return {Promise}
 */
seed.seed = async (knex) => {
  const members = [
    {
      discord_uid: '291828960872890368',
      email: 'thanpolas@gmail.com',
      username: 'thanpolas',
      nickname: 'thanpolas',
      first_name: 'Thanasis',
      last_name: 'Polychronakis',
      is_onboarded: true,
      onboarded_at: '2021-03-04 20:07:06.716969+00',
      bio: 'the bio',
      onboarding_state: 'member',
      verification_code: '...',
      verification_code_expires_at: '2021-03-11 20:06:13.931+00',
      joined_at: '2021-02-17 07:25:59.533+00',
      created_at: '2021-03-04 20:05:41.981843+00',
      updated_at: '2021-03-04 20:07:06.716969+00',
    },
    {
      discord_uid: '391828960872890368',
      email: 'thanpolas+dummy@gmail.com',
      username: 'dummy',
      nickname: 'dummy',
      first_name: 'Than',
      last_name: 'Polas',
      is_onboarded: true,
      onboarded_at: '2021-03-04 20:07:06.716969+00',
      bio: 'the bio',
      onboarding_state: 'member',
      verification_code: '...',
      verification_code_expires_at: '2021-03-11 20:06:13.931+00',
      joined_at: '2021-02-17 07:25:59.533+00',
      created_at: '2021-03-04 20:05:41.981843+00',
      updated_at: '2021-03-04 20:07:06.716969+00',
    },
  ];
  const promises = members.map((member) => {
    return knex.insert(member).into('members');
  });

  await Promise.all(promises);
};
