import { FastifyInstance } from 'fastify'

import {
    createTransaction,
    createTransfer,
    getTransactions,
    updateTransaction,
    deleteTransaction
} from './transactions.controller'

export default async function transactionRoutes(fastify: FastifyInstance) {

    fastify.post('/', { preHandler: [fastify.authenticate], }, createTransaction)

    fastify.post('/transfer', { preHandler: [fastify.authenticate], }, createTransfer)

    fastify.put('/:id', { preHandler: [fastify.authenticate], }, updateTransaction)
    fastify.delete('/:id', { preHandler: [fastify.authenticate], }, deleteTransaction)

    fastify.get('/', { preHandler: [fastify.authenticate], }, getTransactions)
}