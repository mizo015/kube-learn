'use strict';

const fastify = require('fastify')({ logger: true });
const config = require('./config');
const dbPlugin = require('./plugins/db');
const healthRoutes = require('./routes/health');
const infoRoutes = require('./routes/info');
const messagesRoutes = require('./routes/messages');

fastify.register(dbPlugin);
fastify.register(healthRoutes);
fastify.register(infoRoutes);
fastify.register(messagesRoutes);

async function start() {
  try {
    await fastify.listen({ port: config.port, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
