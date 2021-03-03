/**
 * @fileoverview Initializes main data store. In this case, Postgres using Knex.
 */
const config = require('config');
const knex = require('knex');

const log = require('./log.service').get();

const sqldb = (module.exports = {});

/** @type {Knex?} Will store the knex instance reference */
sqldb.knexCore = null;

/**
 * Initialize and connect to core and secrets data store using knex.
 *
 * @return {Promise<Knex>} A knex client.
 */
sqldb.init = async () => {
  //
  // Connect to Main Data Store
  //
  const connectionCore = config.postgres.connection_string;
  const dbOptsCore = {
    pool_min: config.postgres.pool_min,
    pool_max: config.postgres.pool_max,
  };
  sqldb._logConnect(connectionCore, 'Core');
  sqldb.knexCore = await sqldb._connect(connectionCore, dbOptsCore);
  log.notice('Connected to Postgres Main Store.');
};

/**
 * Create a persistent postgres connection.
 *
 * @param {string|Object} connOpts connection string or connection object.
 * @param {Object} dbOpts Needed options for configuring the PG connection.
 * @return {Promise<Knex>} A promise with a knex instance.
 * @private
 */
sqldb._connect = async (connOpts, dbOpts) => {
  const db = knex({
    client: 'pg',
    connection: connOpts,
    migrations: {
      directory: dbOpts.migrationsDirectory,
    },
    debug: false,
    pool: {
      min: dbOpts.pool_min,
      max: dbOpts.pool_max,
    },
    ssl: { rejectUnauthorized: false },
  });

  // verify that SQL connection has been established
  await db.raw('SELECT 1');

  return db;
};

/**
 * Log the postgres connection attempt...
 *
 * @param {string|Object} connOpts connection string or connection object.
 * @param {string} dbName The target PG DB connection is attempted.
 * @private
 */
sqldb._logConnect = (connOpts, dbName) => {
  if (typeof connOpts === 'string') {
    const pgHost = connOpts.split('@')[1];
    log.notice(`Connecting to Postgres ${dbName}...`, {
      custom: { host: pgHost },
    });
  } else {
    log.notice(`Connecting to Postgres ${dbName}...`, {
      custom: {
        host: connOpts.host,
        database: connOpts.database,
      },
    });
  }
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
  log.warn('Closed all postgres connections.');
};
