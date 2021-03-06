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
      `${TABLE}.moderator_discord_uid`,
      `${TABLE}.category`,
      `${TABLE}.reason`,
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

/**
 * Fetch all records.
 *
 * @param {Object=} tx Transaction.
 * @return {Promise<Object>}
 */
sql.getAll = async (tx) => {
  const statement = sql.getSelect();

  if (tx) {
    statement.transacting(tx);
  }

  const result = await statement;

  return result;
};

/**
 * Fetch records by multiple member IDs (multiple).
 *
 * @param {Array<string>} memberIds member ids to filter with.
 * @param {Object=} tx Transaction.
 * @return {Promise<Object>}
 */
sql.getByMemberIds = async (memberIds, tx) => {
  const statement = sql.getSelect();

  statement.whereIn(`${TABLE}.discord_uid`, memberIds);

  if (tx) {
    statement.transacting(tx);
  }

  const result = await statement;
  return result;
};

/**
 * Delete a record based on member id and category.
 *
 * @param {string} memberId Discord member id of banned member.
 * @param {string} category The category to remove the ban from.
 * @param {Object=} tx Transaction.
 * @return {Promise<Object>} A Promise with the number of deleted records.
 */
sql.deleteCombined = async (memberId, category, tx) => {
  const statement = db()
    .table(TABLE)
    .where({ discord_uid: memberId, category })
    .del();

  if (tx) {
    statement.transacting(tx);
  }

  const result = await statement;

  return result;
};
