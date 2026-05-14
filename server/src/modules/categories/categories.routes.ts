import { FastifyInstance } from 'fastify'
import {
    createCategory,
    getCategories,
} from './categories.controller'

export default async function categoriesRoutes(
    fastify: FastifyInstance
) {
    fastify.post(
        '/',
        { preHandler: [fastify.authenticate] },
        createCategory
    )

    fastify.get(
        '/',
        { preHandler: [fastify.authenticate] },
        getCategories
    )
}