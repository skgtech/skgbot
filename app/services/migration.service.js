/**
 * @fileoverview Library responsible for migration operations, gets used only
 *   on special occasions like:
 *   * Heroku deployment.
 */

const config = require('config');
const Knex = require('knex');

const { db } = require('./postgres.service');
const globals = require('../utils/globals');
const log = require('./log.service').get();

const migrationService = (module.exports = {});

migrationService.runHerokuMigration = async () => {
  if (!globals.isHeroku) {
    return;
  }
  log.info('runHerokuMigration() Init');
  const knex = await migrationService.getKnexCore();

  try {
    await knex.migrate.latest();
  } catch (ex) {
    log.error('runHerokuMigration() Failed to run.', { error: ex });
  }

  await knex.destroy();

  log.info('runHerokuMigration() All done');
};

/**
 * Returns knex instance pointing to the core datastore with migration paths
 * configured.
 *
 * @return {Promise<Knex>} knex instance.
 */
migrationService.getKnexCore = async () => {
  const connection = await db();

  const knexOpts = {
    client: 'postgresql',
    connection,
    pool: {
      min: config.postgres.pool_min,
      max: config.postgres.pool_max,
    },
    migrations: {
      directory: config.postgres.migrations.directory,
    },
    seeds: {
      directory: config.postgres.seed_directory,
    },
  };

  return Knex(knexOpts);
};
