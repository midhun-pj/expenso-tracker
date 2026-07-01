import { FastifyInstance } from 'fastify'

import {
    createGroceryItem,
    createGroceryItemsBulk,
    getGroceryItems,
    getGroceryItemById,
    updateGroceryItem,
    deleteGroceryItem,
    getGrocerySummary,
} from './grocery-items.controller'

export default async function groceryItemsRoutes(
    fastify: FastifyInstance
) {
    fastify.post(
        '/',
        {
            preHandler: [fastify.authenticate],
        },
        createGroceryItem
    )

    fastify.post(
        '/bulk',
        {
            preHandler: [fastify.authenticate],
        },
        createGroceryItemsBulk
    )

    fastify.get<{
        Querystring: {
            page?: string
            limit?: string
            search?: string
            month?: string
            supermarketId?: string
        }
    }>(
        '/',
        {
            preHandler: [fastify.authenticate],
        },
        getGroceryItems
    )

    fastify.get<{
        Querystring: {
            page?: string
            limit?: string
            search?: string
        }
    }>(
        '/summary',
        {
            preHandler: [fastify.authenticate],
        },
        getGrocerySummary
    )

    fastify.get<{ Params: { id: string } }>(
        '/:id',
        {
            preHandler: [fastify.authenticate],
        },
        getGroceryItemById
    )

    fastify.patch<{ Params: { id: string } }>(
        '/:id',
        {
            preHandler: [fastify.authenticate],
        },
        updateGroceryItem
    )

    fastify.delete<{ Params: { id: string } }>(
        '/:id',
        {
            preHandler: [fastify.authenticate],
        },
        deleteGroceryItem
    )
}
