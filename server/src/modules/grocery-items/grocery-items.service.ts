import { PrismaClient, GroceryUnit } from '@prisma/client'
import {
    CreateGroceryItemInput,
    UpdateGroceryItemInput,
} from './grocery-items.schema'

const groceryItemInclude = {
    product: { select: { id: true, name: true } },
    supermarket: { select: { id: true, name: true } },
}

export async function createGroceryItemService(
    prisma: PrismaClient,
    userId: string,
    data: CreateGroceryItemInput
) {
    return prisma.groceryItem.create({
        data: {
            productId: data.productId,
            supermarketId: data.supermarketId,
            quantity: data.quantity,
            unit: data.unit as GroceryUnit,
            price: data.price,
            date: new Date(data.date),
            userId,
        },
        include: groceryItemInclude,
    })
}

export async function createGroceryItemsBulkService(
    prisma: PrismaClient,
    userId: string,
    items: CreateGroceryItemInput[]
) {
    const results = []

    for (const data of items) {
        const item = await prisma.groceryItem.create({
            data: {
                productId: data.productId,
                supermarketId: data.supermarketId,
                quantity: data.quantity,
                unit: data.unit as GroceryUnit,
                price: data.price,
                date: new Date(data.date),
                userId,
            },
            include: groceryItemInclude,
        })
        results.push(item)
    }

    return results
}

export async function getGroceryItemsService(
    prisma: PrismaClient,
    userId: string,
    options: {
        page: number
        limit: number
        search?: string
        month?: string
        supermarketId?: string
    }
) {
    const { page, limit, search, month, supermarketId } =
        options
    const skip = (page - 1) * limit

    const where: any = { userId }

    if (supermarketId) {
        where.supermarketId = supermarketId
    }

    if (month) {
        const [year, mon] = month.split('-').map(Number)
        const startDate = new Date(year, mon - 1, 1)
        const endDate = new Date(year, mon, 1)
        where.date = {
            gte: startDate,
            lt: endDate,
        }
    }

    if (search) {
        where.product = {
            name: {
                contains: search,
            },
        }
    }

    const [items, totalCount] = await Promise.all([
        prisma.groceryItem.findMany({
            where,
            include: groceryItemInclude,
            orderBy: { date: 'desc' },
            skip,
            take: limit,
        }),
        prisma.groceryItem.count({ where }),
    ])

    const totalPages = Math.ceil(totalCount / limit)
    const currentPage = Math.min(page, totalPages || 1)

    return {
        data: items,
        pagination: {
            currentPage,
            totalPages,
            totalCount,
            itemsPerPage: limit,
            hasNextPage: currentPage < totalPages,
            hasPrevPage: currentPage > 1,
        },
    }
}

export async function getGroceryItemByIdService(
    prisma: PrismaClient,
    userId: string,
    itemId: string
) {
    return prisma.groceryItem.findFirst({
        where: {
            id: itemId,
            userId,
        },
        include: groceryItemInclude,
    })
}

function pricePerUnit(
    price: number,
    quantity: number,
    unit: string
): number {
    if (unit === 'KG') return price / quantity
    if (unit === 'G') return price / (quantity / 1000)
    if (unit === 'L') return price / quantity
    if (unit === 'ML') return price / (quantity / 1000)
    if (unit === 'COUNT') return price / quantity
    return price / quantity
}

export async function getGroceryItemWithHistoryService(
    prisma: PrismaClient,
    userId: string,
    itemId: string
) {
    const currentItem =
        await prisma.groceryItem.findFirst({
            where: {
                id: itemId,
                userId,
            },
            include: groceryItemInclude,
        })

    if (!currentItem) {
        return null
    }

    // Get all items with the same product for history
    const history = await prisma.groceryItem.findMany({
        where: {
            userId,
            productId: currentItem.productId,
        },
        include: groceryItemInclude,
        orderBy: { date: 'desc' },
    })

    // Calculate statistics
    const totalPurchases = history.length
    let cheapest: (typeof history)[number] | null = null
    let minPpu = Number.POSITIVE_INFINITY

    for (const item of history) {
        const ppu = pricePerUnit(
            item.price,
            item.quantity,
            item.unit
        )
        if (ppu < minPpu) {
            minPpu = ppu
            cheapest = item
        }
    }

    return {
        currentItem,
        history,
        statistics: {
            totalPurchases,
            cheapestPurchase: cheapest
                ? {
                    ...cheapest,
                    pricePerUnit: parseFloat(
                        minPpu.toFixed(2)
                    ),
                }
                : null,
        },
    }
}

export async function updateGroceryItemService(
    prisma: PrismaClient,
    userId: string,
    itemId: string,
    data: UpdateGroceryItemInput
) {
    const updateData: any = { ...data }

    if (data.date) {
        updateData.date = new Date(data.date)
    }

    return prisma.groceryItem.updateMany({
        where: {
            id: itemId,
            userId,
        },
        data: updateData,
    })
}

export async function deleteGroceryItemService(
    prisma: PrismaClient,
    userId: string,
    itemId: string
) {
    const existing = await prisma.groceryItem.findFirst({
        where: {
            id: itemId,
            userId,
        },
    })

    if (!existing) {
        throw new Error('Grocery item not found')
    }

    return prisma.groceryItem.delete({
        where: { id: itemId },
    })
}
