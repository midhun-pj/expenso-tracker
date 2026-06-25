import { FastifyInstance } from 'fastify'

import {
    register,
    login,
    me,
    deleteUser,
} from './auth.controller'

export default async function authRoutes(
    fastify: FastifyInstance
) {
    fastify.post('/register', register)

    fastify.post('/login', login)

    fastify.get(
        '/me',
        {
            preHandler: [fastify.authenticate],
        },
        me
    )

    fastify.delete(
        '/me',
        {
            preHandler: [fastify.authenticate],
        },
        deleteUser
    )
}