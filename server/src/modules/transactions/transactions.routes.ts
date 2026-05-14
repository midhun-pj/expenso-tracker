import { FastifyInstance } from 'fastify'

import {
    createExpense,
    createTransfer,
    getTransactions,
} from './transactions.controller'

export default async function transactionRoutes(
    fastify: FastifyInstance
) {
    fastify.post(
        '/expense',
        {
            preHandler: [fastify.authenticate],
        },
        createExpense
    )

    fastify.post(
        '/transfer',
        {
            preHandler: [fastify.authenticate],
        },
        createTransfer
    )

    fastify.get(
        '/',
        {
            preHandler: [fastify.authenticate],
        },
        getTransactions
    )
}