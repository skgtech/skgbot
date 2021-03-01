/**
 * @fileoverview The services to boot.
 */

const log = require('./services/log.service').get();

const postgresService = require('./services/postgres.service');
const emailService = require('./services/email.service');
const expressService = require('./services/web/express.service');
const migrationService = require('./services/migration.service');
const discordService = require('./services/discord.service');
const entities = require('./entities');

/**
 * Boots all the services of the application.
 *
 */
const appServices = (module.exports = {});

/**
 * Starts all the application's required services.
 * Triggers after all databases are connected.
 *
 * @param {Object} bootOpts A set of options.
 * @return {Promise} a promise.
 */
appServices.boot = async (bootOpts) => {
  log.notice('Booting Services...');

  await postgresService.init();

  await migrationService.runHerokuMigration();

  await expressService.init(bootOpts);

  await emailService.init();

  await discordService.init();

  await entities.init();

  log.notice('Service Boot Finished', { relay: true });
};

/**
 * Dispose of all needed services for a gracefull shutdown.
 *
 * @return {Promise<void>}
 */
appServices.dispose = async () => {
  await postgresService.dispose();
};
