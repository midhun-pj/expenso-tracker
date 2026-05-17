import { PrismaClient } from '@prisma/client'

export async function getDashboardSummary(
    prisma: PrismaClient,
    userId: string
) {
    const accounts = await prisma.account.findMany({
        where: { userId },
    })

    const totalBalance = accounts.reduce(
        (sum, acc) => sum + Number(acc.balance),
        0
    )

    const transactions =
        await prisma.transaction.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 10,
            include: {
                entries: true,
            },
        })

    const expenseAggregation =
        await prisma.transaction.aggregate({
            where: {
                userId,
                type: 'EXPENSE',
            },
            _sum: {
                amount: true,
            },
        })

    const incomeAggregation =
        await prisma.transaction.aggregate({
            where: {
                userId,
                type: 'INCOME',
            },
            _sum: {
                amount: true,
            },
        })

    const transferAggregation =
        await prisma.transaction.aggregate({
            where: {
                userId,
                type: 'TRANSFER',
            },
            _sum: {
                amount: true,
            },
        })

    return {
        totalBalance,
        accounts,
        recentTransactions: transactions,
        summary: {
            totalExpense: expenseAggregation._sum.amount || 0,
            totalTransfer: transferAggregation._sum.amount || 0,
            totalIncome: incomeAggregation._sum.amount || 0,
        },
    }
}