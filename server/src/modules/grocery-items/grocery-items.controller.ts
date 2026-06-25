import { FastifyReply, FastifyRequest } from 'fastify'

import {
    createGroceryItemSchema,
    updateGroceryItemSchema,
    bulkCreateGroceryItemSchema,
} from './grocery-items.schema'

import {
    createGroceryItemService,
    createGroceryItemsBulkService,
    getGroceryItemsService,
    getGroceryItemWithHistoryService,
    updateGroceryItemService,
    deleteGroceryItemService,
} from './grocery-items.service'

export async function createGroceryItem(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const body = createGroceryItemSchema.parse(request.body)
    const user = request.user as any

    const item = await createGroceryItemService(
        request.server.prisma,
        user.userId,
        body
    )

    return reply.code(201).send(item)
}

export async function createGroceryItemsBulk(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const body = bulkCreateGroceryItemSchema.parse(
        request.body
    )
    const user = request.user as any

    const items = await createGroceryItemsBulkService(
        request.server.prisma,
        user.userId,
        body.items
    )

    return reply.code(201).send(items)
}

export async function getGroceryItems(
    request: FastifyRequest<{
        Querystring: {
            page?: string
            limit?: string
            search?: string
            month?: string
            supermarketId?: string
        }
    }>,
    reply: FastifyReply
) {
    const user = request.user as any
    const query = request.query

    const page = Math.max(parseInt(query.page || '1'), 1)
    const limit = Math.min(
        Math.max(parseInt(query.limit || '10'), 1),
        100
    )

    const result = await getGroceryItemsService(
        request.server.prisma,
        user.userId,
        {
            page,
            limit,
            search: query.search?.trim(),
            month: query.month?.trim(),
            supermarketId: query.supermarketId?.trim(),
        }
    )

    return reply.send(result)
}

export async function getGroceryItemById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) {
    const user = request.user as any

    const result =
        await getGroceryItemWithHistoryService(
            request.server.prisma,
            user.userId,
            request.params.id
        )

    if (!result) {
        return reply.code(404).send({
            message: 'Grocery item not found',
        })
    }

    return reply.send(result)
}

export async function updateGroceryItem(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) {
    const body = updateGroceryItemSchema.parse(request.body)
    const user = request.user as any

    const result = await updateGroceryItemService(
        request.server.prisma,
        user.userId,
        request.params.id,
        body
    )

    if (result.count === 0) {
        return reply.code(404).send({
            message: 'Grocery item not found',
        })
    }

    return reply.send({
        message: 'Grocery item updated successfully',
    })
}

export async function deleteGroceryItem(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) {
    const user = request.user as any

    try {
        const result = await deleteGroceryItemService(
            request.server.prisma,
            user.userId,
            request.params.id
        )

        return reply.send({
            message: 'Grocery item deleted successfully',
            item: result,
        })
    } catch (err: any) {
        return reply.code(400).send({
            message: err.message,
        })
    }
}
