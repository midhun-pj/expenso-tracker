import Fastify from 'fastify'
import jwt from '@fastify/jwt'

import prismaPlugin from '../../src/plugins/prisma'

import authRoutes from '../../src/modules/auth/auth.routes'
import accountsRoutes from '../../src/modules/accounts/accounts.routes'
import categoriesRoutes from '../../src/modules/categories/categories.routes'
import transactionRoutes from '../../src/modules/transactions/transactions.routes'
import dashboardRoutes from '../../src/modules/dashboard/dashboard.routes'
import ledgerRoutes from '../../src/modules/ledger/ledger.routes'
import configRoutes from '../../src/modules/settings/settings.routes'
import productsRoutes from '../../src/modules/products/products.routes'
import supermarketsRoutes from '../../src/modules/supermarkets/supermarkets.routes'
import groceryItemsRoutes from '../../src/modules/grocery-items/grocery-items.routes'

export async function buildTestApp() {
    const app = Fastify()

    await app.register(jwt, {
        secret: process.env.JWT_SECRET || 'testsecret',
    })

    app.decorate(
        'authenticate',
        async function (request: any, reply: any) {
            try {
                await request.jwtVerify()
            } catch (err) {
                reply.send(err)
            }
        }
    )

    await app.register(prismaPlugin)

    await app.register(authRoutes, {
        prefix: '/api/auth',
    })

    await app.register(accountsRoutes, {
        prefix: '/api/accounts',
    })

    await app.register(categoriesRoutes, {
        prefix: '/api/categories',
    })

    await app.register(transactionRoutes, {
        prefix: '/api/transactions',
    })

    await app.register(dashboardRoutes, {
        prefix: '/api/dashboard',
    })

    await app.register(ledgerRoutes, {
        prefix: '/api/ledger',
    })

    await app.register(configRoutes, {
        prefix: '/api/config',
    })

    await app.register(productsRoutes, {
        prefix: '/api/products',
    })

    await app.register(supermarketsRoutes, {
        prefix: '/api/supermarkets',
    })

    await app.register(groceryItemsRoutes, {
        prefix: '/api/grocery-items',
    })

    return app
}