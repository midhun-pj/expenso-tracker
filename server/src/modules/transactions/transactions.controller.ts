import { FastifyReply, FastifyRequest } from 'fastify'

import {
    getTransactionsQuerySchema,
    transactionSchema,
    transferSchema,
    updateTransactionDetailsSchema,
} from './transactions.schema'

import {
    createTransactionService,
    createTransferService,
    deleteTransactionService,
    getTransactionsService,
    updateTransactionDetailService,
    updateTransactionService,
} from './transactions.service'


export async function createTransaction(request: FastifyRequest, reply: FastifyReply) {
    const body = transactionSchema.parse(request.body)
    const user = request.user as any

    const result = await createTransactionService(
        request.server.prisma,
        user.userId,
        body
    )

    return reply.code(201).send(result)
}

export async function createTransfer(request: FastifyRequest, reply: FastifyReply) {
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
    request: FastifyRequest, reply: FastifyReply
) {

    const user = request.user as any
    const query = getTransactionsQuerySchema.parse(request.query)

    const data = await getTransactionsService(
        request.server.prisma,
        user.userId,
        query
    )

    return reply.send(data)
}

export async function updateTransaction(request: FastifyRequest, reply: FastifyReply) {
    const body = transactionSchema.parse(request.body)
    const user = request.user as any
    const { id } = request.params as { id: string }

    const result = await updateTransactionService(
        request.server.prisma,
        user.userId,
        {
            ...body,
            id,
        }
    )

    return reply.send(result)
}

export async function deleteTransaction(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user as any
    const { id } = request.params as { id: string }

    const result = await deleteTransactionService(
        request.server.prisma,
        user.userId,
        id
    )

    return reply.send(result)
}

export async function updateTransactionDetails(request: FastifyRequest, reply: FastifyReply) {
    const body = updateTransactionDetailsSchema.parse(request.body)
    const user = request.user as any
    const { id } = request.params as { id: string }

    const result = await updateTransactionDetailService(
        request.server.prisma,
        user.userId,
        id,
        body
    )

    return reply.send(result)
}