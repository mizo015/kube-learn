'use strict';

const fp = require('fastify-plugin');
const fastifyPostgres = require('@fastify/postgres');
const config = require('../config');

async function dbPlugin(fastify) {
  fastify.register(fastifyPostgres, {
    connectionString: `postgresql://${config.db.user}:${config.db.password}@${config.db.host}:${config.db.port}/${config.db.database}`,
  });
}

module.exports = fp(dbPlugin);
