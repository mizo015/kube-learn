'use strict';

const fp = require('fastify-plugin');
const metricsPlugin = require('fastify-metrics');

async function metrics(fastify) {
  fastify.register(metricsPlugin, {
    endpoint: '/metrics',
  });
}

module.exports = fp(metrics);
