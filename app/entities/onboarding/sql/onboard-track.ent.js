/**
 * @fileoverview The "onbord_track" table is responsible for tracking onboarding and
 *    particularly follow up messages and nudges.
 */
const { db } = require('../../../services/postgres.service');

const sql = (module.exports = {});

/** @type {string} Define the table to work on */
const TABLE = 'onboard_track';

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
      `${TABLE}.followup_type`,
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
  const statement = db().insert(input).into(TABLE).returning('id');

  if (tx) {
    statement.transacting(tx);
  }

  const [result] = await statement;
  return result;
};

/**
 * Fetch records by member ID (multiple).
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
 * Fetch records by many member IDs (multiple).
 *
 * @param {Array<string>} memberIds member id to filter with.
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
 * Fetch records by multiple member IDs (multiple).
 *
 * @param {string} type onboard record followup type.
 * @param {Array<string>} memberIds member ids to filter with.
 * @param {Object=} tx Transaction.
 * @return {Promise<Object>}
 */
sql.getByTypeAndMemberIds = async (type, memberIds, tx) => {
  const statement = sql.getSelect();

  statement.where('followup_type', type);
  statement.whereIn(`${TABLE}.discord_uid`, memberIds);

  if (tx) {
    statement.transacting(tx);
  }

  const result = await statement;
  return result;
};
