# Server README

## Overview

This directory contains the backend server for the **Expenso Tracker** application. The server is built with **Fastify**, **TypeScript**, and **Prisma** for database access. It can be run locally via Docker Compose or directly with `pnpm` scripts.


## Quick Start (Development)

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Setup primsa**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Start the development environment**
   ```bash
   pnpm  dev
   ```
   This launches the Fastify server on `http://localhost:3000` with hot‑reloading.
