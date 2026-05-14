import { PrismaClient } from '@prisma/client'

export async function createCategoryService(
    prisma: PrismaClient,
    userId: string,
    categoryData: {
        name: string
        type: 'EXPENSE' | 'INCOME'
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