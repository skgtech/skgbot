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
    table.string('discord_uid', 20).primary();
    table.string('email');
    table.string('username');
    table.string('nickname');
    table.string('first_name');
    table.string('last_name');
    table.text('bio');
    table.timestamp('joined_at').defaultTo(knex.fn.now());
    table.timestamp('left_at');
    table.boolean('is_active').defaultTo(true).notNullable();
    table
      .specificType('member_onboarding_state', 'member_onboarding_state_enum')
      .defaultTo('joined')
      .notNullable();

    defaultFields(table, knex);

    table.index('is_active');
    table.index('nickname');
  });
};

exports.down = async function () {
  return true;
};
