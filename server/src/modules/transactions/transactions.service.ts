import { PrismaClient } from '@prisma/client'
import { GetTransactionsQuery } from '../../models/transaction.model'

export async function createTransactionService(
    prisma: PrismaClient,
    userId: string,
    expense: {
        accountId: string
        amount: number
        description?: string
        date?: string
        type: 'EXPENSE' | 'INCOME'
        categoryId: string
    }
) {
    // Validate that category belongs to the user
    const category = await prisma.category.findFirst({
        where: {
            id: expense.categoryId,
            userId,
        },
    })

    if (!category) {
        throw new Error('Category not found or does not belong to this user')
    }

    // Validate that account belongs to the user
    const account = await prisma.account.findFirst({
        where: {
            id: expense.accountId,
            userId,
        },
    })

    if (!account) {
        throw new Error('Account not found or does not belong to this user')
    }

    return prisma.$transaction(async (tx) => {
        const transaction = await tx.transaction.create({
            data: {
                type: expense.type,
                amount: expense.amount,
                description: expense.description,
                date: expense.date ? new Date(expense.date) : new Date(),
                categoryId: expense.categoryId,
                userId,
            },
            include: {
                category: true,
            },
        })

        // Create transaction entry
        await tx.transactionEntry.create({
            data: {
                transactionId: transaction.id,
                accountId: expense.accountId,
                type: expense.type === 'INCOME' ? 'DEBIT' : 'CREDIT',
                amount: expense.amount,
            },
        })

        // Update account balance
        if (expense.type === 'INCOME') {
            await tx.account.update({
                where: { id: expense.accountId },
                data: {
                    balance: {
                        increment: expense.amount,
                    },
                },
            })
        } else {
            await tx.account.update({
                where: { id: expense.accountId },
                data: {
                    balance: {
                        decrement: expense.amount,
                    },
                },
            })
        }

        return transaction
    })
}

export async function createTransferService(
    prisma: PrismaClient,
    userId: string,
    data: {
        fromAccountId: string
        toAccountId: string
        amount: number
        description?: string
        date?: string
    }
) {
    // Validate both accounts belong to the user
    const accounts = await prisma.account.findMany({
        where: {
            id: {
                in: [data.fromAccountId, data.toAccountId],
            },
            userId,
        },
    })

    if (accounts.length !== 2) {
        throw new Error('One or both accounts not found or do not belong to this user')
    }

    return prisma.$transaction(async (tx) => {
        const transaction = await tx.transaction.create({
            data: {
                type: 'TRANSFER',
                amount: data.amount,
                description: data.description,
                date: data.date ? new Date(data.date) : new Date(),
                userId,
            },
        })

        await tx.transactionEntry.createMany({
            data: [
                {
                    transactionId: transaction.id,
                    accountId: data.fromAccountId,
                    type: 'CREDIT',
                    amount: data.amount,
                },
                {
                    transactionId: transaction.id,
                    accountId: data.toAccountId,
                    type: 'DEBIT',
                    amount: data.amount,
                },
            ],
        })

        await tx.account.update({
            where: { id: data.fromAccountId },
            data: {
                balance: {
                    decrement: data.amount,
                },
            },
        })

        await tx.account.update({
            where: { id: data.toAccountId },
            data: {
                balance: {
                    increment: data.amount,
                },
            },
        })

        return transaction
    })
}

export async function getTransactionsService(
    prisma: PrismaClient,
    userId: string,
    query: GetTransactionsQuery
) {

    const {
        page = 1,
        limit = 20,

        year,
        month,

        type,

        categoryId,

        accountId,

        search,
    } = query


    const skip = (page - 1) * limit

    const where: any = {
        userId,
    }

    if (year || month) {
        const startDate = new Date(
            year || new Date().getFullYear(),
            month ? month - 1 : 0,
            1
        )

        const endDate = new Date(
            year || new Date().getFullYear(),
            month ? month : 12,
            1
        )

        where.date = {
            gte: startDate,
            lt: endDate,
        }
    }

    if (type) {
        where.type = type
    }

    if (categoryId) {
        where.categoryId = categoryId
    }

    if (accountId) {
        where.accountId = accountId
    }

    if (search) {
        where.OR = [
            { description: { contains: search } }
        ]
    }

    const [
        transactions,
        total,
    ] = await prisma.$transaction([
        prisma.transaction.findMany({
            where,

            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                    },
                },

                entries: {
                    include: {
                        account: {
                            select: {
                                id: true,
                                name: true,
                                type: true,
                                balance: true,
                            },
                        },
                    },
                },
            },

            orderBy: {
                date: 'desc',
            },

            skip,

            take: limit,
        }),

        prisma.transaction.count({
            where,
        }),
    ])




    return {
        data: transactions,

        pagination: {
            page,
            limit,

            total,

            totalPages: Math.ceil(total / limit),
        },
    }
}

export async function updateTransactionService(
    prisma: PrismaClient,
    userId: string,
    expense: {
        id: string
        accountId: string
        amount: number
        description?: string
        date?: string
        type: 'EXPENSE' | 'INCOME'
        categoryId: string
    }
) {
    // Validate that category belongs to the user
    const category = await prisma.category.findFirst({
        where: {
            id: expense.categoryId,
            userId,
        },
    })

    if (!category) {
        throw new Error('Category not found or does not belong to this user')
    }

    // Validate that account belongs to the user
    const account = await prisma.account.findFirst({
        where: {
            id: expense.accountId,
            userId,
        },
    })

    if (!account) {
        throw new Error('Account not found or does not belong to this user')
    }

    return prisma.$transaction(async (tx) => {
        const transaction = await tx.transaction.update({
            where: { id: expense.id },
            data: {
                type: expense.type,
                amount: expense.amount,
                description: expense.description,
                date: expense.date ? new Date(expense.date) : new Date(),
                categoryId: expense.categoryId,
                userId,
            },
            include: {
                category: true,
            },
        })

        // Update transaction entry
        await tx.transactionEntry.deleteMany({
            where: { transactionId: transaction.id },
        })

        // Create new transaction entry
        await tx.transactionEntry.create({
            data: {
                transactionId: transaction.id,
                accountId: expense.accountId,
                type: expense.type === 'INCOME' ? 'DEBIT' : 'CREDIT',
                amount: expense.amount,
            },
        })

        // Update account balance
        if (expense.type === 'INCOME') {
            await tx.account.update({
                where: { id: expense.accountId },
                data: {
                    balance: {
                        increment: expense.amount,
                    },
                },
            })
        } else {
            await tx.account.update({
                where: { id: expense.accountId },
                data: {
                    balance: {
                        decrement: expense.amount,
                    },
                },
            })
        }

        return transaction
    })
}

export async function deleteTransactionService(
    prisma: PrismaClient,
    userId: string,
    id: string
) {
    return prisma.$transaction(async (tx) => {
        const transaction = await tx.transaction.findUnique({
            where: { id },
        })

        if (!transaction) {
            throw new Error('Transaction not found')
        }

        if (transaction.userId !== userId) {
            throw new Error('Transaction does not belong to this user')
        }

        await tx.transactionEntry.deleteMany({
            where: { transactionId: transaction.id },
        })

        await tx.transaction.delete({
            where: { id: transaction.id },
        })

        return transaction
    })
}
