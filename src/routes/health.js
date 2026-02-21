'use strict';

async function healthRoutes(fastify) {
  // Liveness probe — always returns 200 if the process is running
  fastify.get('/healthz', async () => {
    return { status: 'ok' };
  });

  // Readiness probe — returns 200 only if the DB connection is healthy
  fastify.get('/readyz', async (request, reply) => {
    try {
      const client = await fastify.pg.connect();
      await client.query('SELECT 1');
      client.release();
      return { status: 'ready' };
    } catch (err) {
      reply.code(503);
      return { status: 'not ready', error: err.message };
    }
  });
}

module.exports = healthRoutes;
