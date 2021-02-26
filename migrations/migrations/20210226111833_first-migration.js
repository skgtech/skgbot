const { defaultFields } = require('../migration-helpers');

exports.up = async function (knex) {
  // Required if gen_random_uuid() PG method doesn't work:
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS pgcrypto');

  //
  // Member State Enumeration
  //
  await knex.raw(`
    CREATE TYPE member_onboarding_state_enum AS ENUM (
      'joined',
      'full_name',
      'email',
      'bio',
      'member'
    );
  `);

  //
  // The Members Table
  //
  await knex.schema.createTable('members', function (table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('discord_uid', 20);
    table.string('nickname');
    table.boolean('is_active').defaultTo(true).notNullable();
    table.timestamp('joined_at').defaultTo(knex.fn.now());
    table.string('real_name');
    table.string('email');
    table.text('bio');
    table
      .specificType('member_onboarding_state', 'member_onboarding_state_enum')
      .defaultTo('joined')
      .notNullable();

    defaultFields(table, knex);

    table.unique('discord_uid');
    table.index('is_active');
  });
};

exports.down = async function () {
  return true;
};
