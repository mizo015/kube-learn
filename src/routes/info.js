'use strict';

const config = require('../config');

async function infoRoutes(fastify) {
  fastify.get('/info', async () => {
    let dbConnected = false;
    try {
      const client = await fastify.pg.connect();
      await client.query('SELECT 1');
      client.release();
      dbConnected = true;
    } catch {
      // db not reachable
    }

    return {
      app: 'kube-learn-api',
      version: '1.0.0',
      uptime: process.uptime(),
      db_connected: dbConnected,
    };
  });
}

module.exports = infoRoutes;
