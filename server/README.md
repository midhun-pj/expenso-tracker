# Server README

## Overview

This directory contains the backend server for the **Expenso Tracker** application. The server is built with **Fastify**, **TypeScript**, and **Prisma** for database access. It can be run locally via Docker Compose or directly with `npm` scripts.

## Quick Start (Development)

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Start the development environment**
   ```bash
   pnpm  dev
   ```
   This launches the Fastify server on `http://localhost:3000` with hot‑reloading.

3. **Run tests**
   ```bash
   pnpm test
   ```

## Deploying a New Build
 ```bash
   pnpm build
   ```


## Handling Database Changes

The server uses **Prisma Migrate**. Follow these steps whenever you modify the schema:

1. **Update the Prisma schema** (`prisma/schema.prisma`).
2. **Create a migration**
   ```bash
   npx prisma migrate dev --name <descriptive-name>
   ```
   - This updates your local dev database and generates migration files.
3. **Commit the migration files** under `prisma/migrations/`.
4. **Apply migrations in other environments** (staging/production) using:
   ```bash
   npx prisma migrate deploy
   ```
   This runs all pending migrations against the target database.

### Tips
- **Never edit the generated migration SQL directly**; let Prisma handle it.
- **Backup production data** before running `prisma migrate deploy`.
- Use **environment variables** (`DATABASE_URL`) to point to the correct database for each environment.

## Common Commands

| Action | Command |
|--------|---------|
| Run server locally | `npm run dev` |
| Run production build | `npm run start` |
| Run tests | `npm test` |
| Generate Prisma client | `npx prisma generate` |
| Create migration | `npx prisma migrate dev --name <name>` |
| Deploy migrations | `npx prisma migrate deploy` |

## Resources
- Prisma Docs: https://www.prisma.io/docs
- Fastify Docs: https://www.fastify.io/docs/latest/

---
*This README is intended for developers working on the server component of the Expenso Tracker project.*
