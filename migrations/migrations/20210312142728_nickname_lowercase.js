/**
 * @fileoverview Adds the nickname_lowercase column on members and populates it.
 */

exports.up = async function (knex) {
  await knex.schema.table('members', (table) => {
    table.string('nickname_lowercase', 40);

    table.unique('nickname_lowercase');
  });

  await knex.raw(`
    UPDATE members SET "nickname_lowercase"=LOWER("nickname");
  `);
};

exports.down = function () {};
