import { FastifyReply, FastifyRequest } from 'fastify'

import { createAccountSchema, updateAccountSchema } from './accounts.schema'

import {
    createAccountService,
    getAccountsService,
    getAccountByIdService,
    updateAccountService,
    deleteAccountService,
} from './accounts.service'

export async function createAccount(request: FastifyRequest, reply: FastifyReply) {
    const body = createAccountSchema.parse(request.body)

    const user = request.user as any

    const account = await createAccountService(
        request.server.prisma,
        user.userId,
        body
    )

    return reply.code(201).send(account)
}

export async function getAccounts(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user as any

     const { search = "" } = request.query as {    search?: string  };

    const accounts = await getAccountsService(
        request.server.prisma,
        user.userId,
        search
    )

    return reply.send(accounts)
}

export async function getAccountById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) {
    const user = request.user as any

    const account = await getAccountByIdService(
        request.server.prisma,
        user.userId,
        request.params.id
    )

    if (!account) {
        return reply.code(404).send({
            message: 'Account not found',
        })
    }

    return reply.send(account)
}

export async function updateAccount(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) {
    const body = updateAccountSchema.parse(request.body)

    const user = request.user as any

    const result = await updateAccountService(
        request.server.prisma,
        user.userId,
        request.params.id,
        body
    )

    if (result.count === 0) {
        return reply.code(404).send({
            message: 'Account not found',
        })
    }

    return reply.send({
        message: 'Account updated successfully',
    })
}


export async function deleteAccount(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) {
    const user = request.user as any

    try {
        const result = await deleteAccountService(
            request.server.prisma,
            user.userId,
            request.params.id
        )

        return reply.send({
            message: 'Account deleted successfully',
            account: result,
        })
    } catch (err: any) {
        return reply.code(400).send({
            message: err.message,
        })
    }
}