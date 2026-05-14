import { FastifyInstance } from 'fastify'
import { getConfig, saveConfig } from './config.controller'

export default async function configRoutes(fastify: FastifyInstance) {
    fastify.get('/', { preHandler: [fastify.authenticate] }, getConfig)
    fastify.post('/', { preHandler: [fastify.authenticate] }, saveConfig)
}
