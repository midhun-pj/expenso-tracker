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
            const { month, year } = request.query as {
                month?: string
                year?: string
            }

            return getDashboardSummary(fastify.prisma, user.userId, {
                month: month ? parseInt(month) : undefined,
                year: year ? parseInt(year) : undefined,
            })
        }

    )
}