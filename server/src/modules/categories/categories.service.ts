import { PrismaClient } from '@prisma/client'
import { TransactionCategoryType } from '@models/common.model'

export async function createCategoryService(
    prisma: PrismaClient,
    userId: string,
    categoryData: {
        name: string
        type: TransactionCategoryType
    }
) {
    return prisma.category.create({
        data: {
            ...categoryData,
            userId,
        },
    })
}

export async function getCategoriesService(
    prisma: PrismaClient,
    userId: string
) {
    return prisma.category.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    })
}