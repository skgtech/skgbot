/**
 * @fileoverview Initializes main data store. In this case, Postgres using Knex.
 */
const config = require('config');
const knex = require('knex');

const log = require('./log.service').get();

const sqldb = (module.exports = {});

/** @type {Knex?} Will store the knex instance reference */
sqldb.knexCore = null;

/** @type {Object} Knex configuration */
sqldb.knexConfig = {
  client: 'pg',
  connection: config.postgres.connection_string,
  migrations: {
    directory: config.postgres.migrations.directory,
  },
  debug: false,
  pool: {
    min: config.postgres.pool_min,
    max: config.postgres.pool_max,
  },
};

/**
 * Initialize and connect to core and secrets data store using knex.
 *
 * @return {Promise<Knex>} A knex client.
 */
sqldb.init = async () => {
  //
  // Connect to Main Data Store
  //
  sqldb.knexCore = knex(sqldb.knexConfig);

  log.notice('Connected to Postgres.');
};

/**
 * Return Core Knex instance.
 *
 * @return {Knex}
 */
sqldb.db = () => sqldb.knexCore;

/**
 * Closes database connections.
 *
 * @return {Promise<void>}
 */
sqldb.dispose = async () => {
  await sqldb.db().destroy();
  delete sqldb.db;
  await log.warn('Closed all postgres connections.');
};
