import { PrismaClient } from '@prisma/client'

export async function createTransactionService(
    prisma: PrismaClient,
    userId: string,
    data: {
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
            id: data.categoryId,
            userId,
        },
    })

    if (!category) {
        throw new Error('Category not found or does not belong to this user')
    }

    // Validate that account belongs to the user
    const account = await prisma.account.findFirst({
        where: {
            id: data.accountId,
            userId,
        },
    })

    if (!account) {
        throw new Error('Account not found or does not belong to this user')
    }

    return prisma.$transaction(async (tx) => {
        const transaction = await tx.transaction.create({
            data: {
                type: data.type === 'INCOME' ? 'INCOME' : 'EXPENSE',
                amount: data.amount,
                description: data.description,
                date: data.date ? new Date(data.date) : new Date(),
                categoryId: data.categoryId,
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
                accountId: data.accountId,
                type: data.type === 'INCOME' ? 'DEBIT' : 'CREDIT',
                amount: data.amount,
            },
        })

        // Update account balance
        if (data.type === 'INCOME') {
            await tx.account.update({
                where: { id: data.accountId },
                data: {
                    balance: {
                        increment: data.amount,
                    },
                },
            })
        } else {
            await tx.account.update({
                where: { id: data.accountId },
                data: {
                    balance: {
                        decrement: data.amount,
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
    userId: string
) {
    return prisma.transaction.findMany({
        where: { userId },
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
    })
}