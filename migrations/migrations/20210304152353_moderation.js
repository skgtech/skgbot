const { defaultFields } = require('../migration-helpers');

exports.up = async function (knex) {
  /**
   * The moderation table, marks which members are not allowed to join certain
   * topics. A wildcard character of "*" (without the quotes) translates to
   * any topic category, so they are forever in the "welcome-to-skgtech"
   * channel.
   */
  await knex.schema.createTable('moderation', function (table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('discord_uid', 20);
    table.string('category').notNullable();
    table
      .string('moderator_discord_uid', 20)
      .references('members.discord_uid')
      .onDelete('NO ACTION');
    table.string('reason');
    defaultFields(table, knex);

    table.index('discord_uid');
    table.unique(['discord_uid', 'category']);
  });
};

exports.down = function () {};
