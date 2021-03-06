const { defaultFields } = require('../migration-helpers');

exports.up = async function (knex) {
  /**
   * The "onbord_track" table is responsible for tracking onboarding and
   * particularly follow up messages and nudges.
   */
  await knex.schema.createTable('onboard_track', function (table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('discord_uid', 20);
    table.string('followup_type', 20);

    defaultFields(table, knex);

    table.index('discord_uid');
    table.unique(['discord_uid', 'category']);
  });
};

exports.down = function () {};
