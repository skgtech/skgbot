/**
 * @fileoverview Member related SQL queries. There is no business logic involved
 *   in these operations.
 */
const { db } = require('../../../services/postgres.service');

const sql = (module.exports = {});

/** @type {string} Define the table to work on */
const TABLE = 'members';

/**
 * Return the SELECT statement to be performed for all member queries.
 *
 * This is the API representation of this model.
 *
 * @return {Object} knex statement.
 */
sql.getSelect = () => {
  const statement = db()
    .select(
      'members.discord_uid',
      'members.email',
      'members.username',
      'members.nickname',
      'members.first_name',
      'members.last_name',
      'members.is_onboarded',
      'members.onboarded_at',
      'members.bio',
      'members.onboarding_state',
      'members.verification_code',
      'members.verification_code_expires_at',
      'members.joined_at',
      'members.left_at',
      'members.created_at',
      'members.updated_at',
    )
    .from(TABLE);

  return statement;
};

/**
 * Creates a member.
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
 * Update a member.
 *
 * @param {string} memberId The member ID
 * @param {Object} input The data to be updated
 * @param {Object=} tx Transaction.
 * @return {Promise<string>} The member id.
 */
sql.update = async (memberId, input = {}, tx) => {
  input.updated_at = db().fn.now();

  const statement = db()
    .table(TABLE)
    .where('discord_uid', memberId)
    .update(input)
    .returning('discord_uid');

  if (tx) {
    statement.transacting(tx);
  }

  const [result] = await statement;
  return result;
};

/**
 * Fetch a member by ID (single).
 *
 * @param {string} memberId member id to filter with.
 * @param {Object=} tx Transaction.
 * @return {Promise<Object>}
 */
sql.getById = async (memberId, tx) => {
  const statement = sql.getSelect();

  statement.where('members.discord_uid', memberId);

  if (tx) {
    statement.transacting(tx);
  }

  const [result] = await statement;
  return result || null;
};

/**
 * Fetch a member by email (single).
 *
 * @param {string} email email to filter with.
 * @param {Object=} tx Transaction.
 * @return {Promise<Object>}
 */
sql.getByEmail = async (email, tx) => {
  const statement = sql.getSelect();

  statement.where('email', email);

  if (tx) {
    statement.transacting(tx);
  }

  const [result] = await statement;
  return result || null;
};

/**
 * Fetch a member by nickname.
 *
 * @param {string} nickname nickname to filter with.
 * @param {Object=} tx Transaction.
 * @return {Promise<Object>}
 */
sql.getByNickname = async (nickname, tx) => {
  const statement = sql.getSelect();

  statement.whereRaw(`LOWER(nickname) LIKE '${nickname.toLowerCase()}'`);

  if (tx) {
    statement.transacting(tx);
  }

  const [result] = await statement;
  return result || null;
};

/**
 * Fetch members that have joined based on the join date.
 *
 * @param {string} dtFrom Date from when to fetch records.
 * @param {Object=} tx Transaction.
 * @return {Promise<Array<Object>>}
 */
sql.getJoinedMembersByDt = async (dtFrom, tx) => {
  const statement = sql.getSelect();

  statement.where('onboarding_state', 'joined');
  statement.where('joined_at', '>', dtFrom);

  if (tx) {
    statement.transacting(tx);
  }

  const result = await statement;
  return result;
};
