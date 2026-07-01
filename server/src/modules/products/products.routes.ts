import { FastifyInstance } from 'fastify'

import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} from './products.controller'

export default async function productsRoutes(
    fastify: FastifyInstance
) {
    fastify.post(
        '/',
        {
            preHandler: [fastify.authenticate],
        },
        createProduct
    )

    fastify.get(
        '/',
        {
            preHandler: [fastify.authenticate],
        },
        getProducts
    )

    fastify.get<{ Params: { id: string } }>(
        '/:id',
        {
            preHandler: [fastify.authenticate],
        },
        getProductById
    )

    fastify.patch<{ Params: { id: string } }>(
        '/:id',
        {
            preHandler: [fastify.authenticate],
        },
        updateProduct
    )

    fastify.delete<{ Params: { id: string } }>(
        '/:id',
        {
            preHandler: [fastify.authenticate],
        },
        deleteProduct
    )
}
