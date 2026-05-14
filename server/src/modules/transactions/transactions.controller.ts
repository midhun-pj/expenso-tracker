import { FastifyReply, FastifyRequest } from 'fastify'

import {
    transactionSchema,
    transferSchema,
} from './transactions.schema'

import {
    createTransactionService,
    createTransferService,
    getTransactionsService,
} from './transactions.service'

export async function createExpense(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const body = transactionSchema.parse(request.body)
    const user = request.user as any

    const result = await createTransactionService(
        request.server.prisma,
        user.userId,
        body
    )

    return reply.code(201).send(result)
}

export async function createTransfer(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const body = transferSchema.parse(request.body)
    const user = request.user as any

    const result = await createTransferService(
        request.server.prisma,
        user.userId,
        body
    )

    return reply.code(201).send(result)
}

export async function getTransactions(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const user = request.user as any

    const data = await getTransactionsService(
        request.server.prisma,
        user.userId
    )

    return reply.send(data)
}