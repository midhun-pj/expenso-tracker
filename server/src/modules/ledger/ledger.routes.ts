import { FastifyInstance } from 'fastify'
import { validateLedger } from './ledger.service'

export default async function ledgerRoutes(
    fastify: FastifyInstance
) {
    fastify.get(
        '/validate',
        { preHandler: [fastify.authenticate] },
        async (request) => {
            const user = request.user as any

            return validateLedger(
                fastify.prisma,
                user.userId
            )
        }
    )
}