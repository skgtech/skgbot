/**
 * @fileoverview Moderation related SQL queries. There is no business logic involved
 *   in these operations.
 */
const { db } = require('../../../services/postgres.service');

const sql = (module.exports = {});

/** @type {string} Define the table to work on */
const TABLE = 'moderation';

/**
 * Return the SELECT statement to be performed for all queries.
 *
 * This is the API representation of this model.
 *
 * @return {Object} knex statement.
 */
sql.getSelect = () => {
  const statement = db()
    .select(
      `${TABLE}.id`,
      `${TABLE}.discord_uid`,
      `${TABLE}`,
      `${TABLE}.category`,
      `${TABLE}.created_at`,
      `${TABLE}.updated_at`,
    )
    .from(TABLE);

  return statement;
};

/**
 * Creates a record.
 *
 * @param {Object} input Sanitized input.
 * @param {Object=} tx Transaction.
 * @return {Promise<string>} The id of the created member.
 */
sql.create = async (input, tx) => {
  const statement = db().insert(input).into(TABLE).returning('discord_uid');

  if (tx) {
    statement.transacting(tx);
  }

  const [result] = await statement;
  return result;
};

/**
 * Fetch a record by member ID (multiple).
 *
 * @param {string} memberId member id to filter with.
 * @param {Object=} tx Transaction.
 * @return {Promise<Object>}
 */
sql.getByMemberId = async (memberId, tx) => {
  const statement = sql.getSelect();

  statement.where(`${TABLE}.discord_uid`, memberId);

  if (tx) {
    statement.transacting(tx);
  }

  const result = await statement;
  return result;
};

/**
 * Fetch a record by moderator member ID (multiple).
 *
 * @param {string} memberId member id to filter with.
 * @param {Object=} tx Transaction.
 * @return {Promise<Object>}
 */
sql.getByModeratorMemberId = async (memberId, tx) => {
  const statement = sql.getSelect();

  statement.where(`${TABLE}.moderator_discord_uid`, memberId);

  if (tx) {
    statement.transacting(tx);
  }

  const result = await statement;
  return result;
};
