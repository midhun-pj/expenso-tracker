import { FastifyReply, FastifyRequest } from 'fastify'
import { saveConfigSchema } from './settings.schema'
import { getConfigService, saveConfigService } from './settings.service'

export async function getConfig(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user as { userId: string }
    const data = await getConfigService(request.server.prisma, user.userId)
    return reply.send(data)
}

export async function saveConfig(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user as { userId: string }
    const body = saveConfigSchema.parse(request.body)
    const data = await saveConfigService(request.server.prisma, user.userId, body)

    return reply.send(data)
}
