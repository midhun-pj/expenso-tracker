import { FastifyReply, FastifyRequest } from 'fastify'
import { createCategorySchema } from './categories.schema'
import {
    createCategoryService,
    getCategoriesService,
} from './categories.service'

export async function createCategory(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const body = createCategorySchema.parse(request.body)
    const user = request.user as any

    const category = await createCategoryService(
        request.server.prisma,
        user.userId,
        body
    )

    return reply.code(201).send(category)
}

export async function getCategories(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const user = request.user as any

    const data = await getCategoriesService(
        request.server.prisma,
        user.userId
    )

    return reply.send(data)
}