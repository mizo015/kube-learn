'use strict';

async function messagesRoutes(fastify) {
  // Auto-create the messages table on startup
  const client = await fastify.pg.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
  } finally {
    client.release();
  }

  fastify.post('/messages', async (request, reply) => {
    const { content } = request.body || {};

    if (typeof content !== 'string' || content.trim() === '') {
      reply.code(400);
      return { error: 'content must be a non-empty string' };
    }

    const client = await fastify.pg.connect();
    try {
      const { rows } = await client.query(
        'INSERT INTO messages (content) VALUES ($1) RETURNING id, content, created_at',
        [content]
      );
      reply.code(201);
      return rows[0];
    } finally {
      client.release();
    }
  });
}

module.exports = messagesRoutes;
