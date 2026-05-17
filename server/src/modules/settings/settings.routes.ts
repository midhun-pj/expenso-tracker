import { FastifyInstance } from 'fastify'
import { getConfig, saveConfig } from './settings.controller'

export default async function settingsRoutes(fastify: FastifyInstance) {
    fastify.get('/', { preHandler: [fastify.authenticate] }, getConfig)
    fastify.post('/', { preHandler: [fastify.authenticate] }, saveConfig)
}
