import { FastifyInstance } from 'fastify'

import {
    createSupermarket,
    getSupermarkets,
    getSupermarketById,
    updateSupermarket,
    deleteSupermarket,
} from './supermarkets.controller'

export default async function supermarketsRoutes(
    fastify: FastifyInstance
) {
    fastify.post(
        '/',
        {
            preHandler: [fastify.authenticate],
        },
        createSupermarket
    )

    fastify.get(
        '/',
        {
            preHandler: [fastify.authenticate],
        },
        getSupermarkets
    )

    fastify.get<{ Params: { id: string } }>(
        '/:id',
        {
            preHandler: [fastify.authenticate],
        },
        getSupermarketById
    )

    fastify.patch<{ Params: { id: string } }>(
        '/:id',
        {
            preHandler: [fastify.authenticate],
        },
        updateSupermarket
    )

    fastify.delete<{ Params: { id: string } }>(
        '/:id',
        {
            preHandler: [fastify.authenticate],
        },
        deleteSupermarket
    )
}
