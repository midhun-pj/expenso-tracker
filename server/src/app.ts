import Fastify from 'fastify'

import prismaPlugin from './plugins/prisma'
import jwtPlugin from './plugins/jwt'
import authPlugin from './plugins/auth'

import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import cookie from '@fastify/cookie'
import rateLimit from '@fastify/rate-limit'

import authRoutes from './modules/auth/auth.routes'
import accountsRoutes from './modules/accounts/accounts.routes'
import transactionRoutes from './modules/transactions/transactions.routes'
import dashboardRoutes from './modules/dashboard/dashboard.routes'
import categoriesRoutes from './modules/categories/categories.routes'
import settingsRoutes from './modules/settings/settings.routes'

export const app = Fastify({
    logger: true,
})

async function registerPlugins() {
    await app.register(cors, {
        origin: true,
        methods: [
            'GET',
            'POST',
            'PUT',
            'PATCH',
            'DELETE',
            'OPTIONS',
        ],
        credentials: true,
    })

    await app.register(helmet)
    await app.register(cookie)

    await app.register(rateLimit, {
        max: 100,
        timeWindow: '1 minute',
    })

    await app.register(prismaPlugin)
    await app.register(jwtPlugin)
    await app.register(authPlugin)

    app.register(authRoutes, {
        prefix: '/api/v1/auth',
    })

    app.register(accountsRoutes, {
        prefix: '/api/v1/accounts',
    })

    app.register(transactionRoutes, {
        prefix: '/api/v1/transactions',
    })

    app.register(dashboardRoutes, {
        prefix: '/api/v1/dashboard',
    })

    app.register(categoriesRoutes, {
        prefix: '/api/v1/categories',
    })

    app.register(settingsRoutes, {
        prefix: '/api/v1/config',
    })
}

// Export a promise that resolves when plugins are registered
export const pluginsReady = registerPlugins()