import { FastifyInstance } from 'fastify'

import { getDashboardSummary } from './dashboard.service'

export default async function dashboardRoutes(
    fastify: FastifyInstance
) {
    fastify.get(
        '/summary',
        {
            preHandler: [fastify.authenticate],
        },
        async (request) => {
            const user = request.user as any

            return getDashboardSummary(
                fastify.prisma,
                user.userId
            )
        }
    )
}