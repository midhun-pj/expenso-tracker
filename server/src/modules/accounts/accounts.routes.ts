import { FastifyInstance } from 'fastify'

import {
    createAccount,
    getAccounts,
    getAccountById,
    updateAccount,
    deleteAccount,
} from './accounts.controller'

export default async function accountsRoutes(
    fastify: FastifyInstance
) {
    fastify.post(
        '/',
        {
            preHandler: [fastify.authenticate],
        },
        createAccount
    )

    fastify.get(
        '/',
        {
            preHandler: [fastify.authenticate],
        },
        getAccounts
    )

    fastify.get<{ Params: { id: string } }>(
        '/:id',
        {
            preHandler: [fastify.authenticate],
        },
        getAccountById
    )

    fastify.patch<{ Params: { id: string } }>(
        '/:id',
        {
            preHandler: [fastify.authenticate],
        },
        updateAccount
    )

    fastify.delete<{ Params: { id: string } }>(
        '/:id',
        {
            preHandler: [fastify.authenticate],
        },
        deleteAccount
    )
}