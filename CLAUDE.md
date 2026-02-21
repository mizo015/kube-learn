# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Fastify API with PostgreSQL, designed to learn Kubernetes deployment patterns. The app exposes health/readiness probes and an info endpoint, deployed to k8s with a StatefulSet-backed Postgres instance.

## Commands

```bash
# Run locally (requires PostgreSQL running on localhost:5432)
npm start

# Build Docker image
docker build -t kube-learn-api .

# Deploy to minikube
eval $(minikube docker-env)          # use minikube's Docker daemon
docker build -t kube-learn-api .     # build image inside minikube
kubectl apply -f k8s/               # apply all manifests

# Verify deployment
kubectl get all -n kube-learn
```

No test runner, linter, or TypeScript configured.

## Architecture

**Fastify plugin-based architecture** using CommonJS modules.

- `src/index.js` — Entry point. Creates Fastify instance, registers plugins and routes, starts server.
- `src/config.js` — Reads environment variables (`PORT`, `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`) with sensible defaults.
- `src/plugins/db.js` — Registers `@fastify/postgres` using config values. Exposes `fastify.pg` for queries throughout the app.
- `src/routes/health.js` — `GET /healthz` (liveness, always 200) and `GET /readyz` (readiness, checks DB connection).
- `src/routes/info.js` — `GET /info` returns app name, version, uptime, and DB connection status.

## Kubernetes Setup

All manifests live in `k8s/` under namespace `kube-learn`:

- **Deployment** (`kube-learn-api`): 2 replicas, `imagePullPolicy: IfNotPresent`, env from ConfigMap + Secret, liveness/readiness probes on `/healthz` and `/readyz`.
- **PostgreSQL StatefulSet**: Single replica, `postgres:16-alpine`, 1Gi PVC, headless service named `postgres` (used as `DB_HOST`).
- **ConfigMap**: Non-sensitive env vars (port, DB host/port/name).
- **Secret**: DB credentials (base64-encoded).
