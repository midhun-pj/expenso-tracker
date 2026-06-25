import { PrismaClient } from '@prisma/client'

export async function getDashboardSummary(
    prisma: PrismaClient,
    userId: string,
    query?: { month?: number; year?: number }
) {
    const whereClause: any = { userId }

    if (query?.year) {
        const startDate = new Date(query.year, query.month ? query.month - 1 : 0, 1)
        const endDate = new Date(query.year, query.month ? query.month : 12, 0, 23, 59, 59, 999)
        whereClause.date = {
            gte: startDate,
            lte: endDate,
        }
    }

    const accounts = await prisma.account.findMany({
        where: { userId },
    })

    const totalBalance = accounts.reduce(
        (sum, acc) => sum + Number(acc.balance),
        0
    )

    const recentTransactions = await prisma.transaction.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: 10,
        include: {
            category: true,
        },
    })

    const expenseAggregation = await prisma.transaction.aggregate({
        where: { ...whereClause, type: 'EXPENSE' },
        _sum: { amount: true },
    })

    const incomeAggregation = await prisma.transaction.aggregate({
        where: { ...whereClause, type: 'INCOME' },
        _sum: { amount: true },
    })

    // Category-wise expense (Pie Chart)
    const categoryExpenses = await prisma.transaction.groupBy({
        by: ['categoryId'],
        where: { ...whereClause, type: 'EXPENSE' },
        _sum: { amount: true },
    })

    const categories = await prisma.category.findMany({
        where: { id: { in: categoryExpenses.map(c => c.categoryId).filter(id => id !== null) as string[] } }
    })

    const pieData = categoryExpenses.map(item => {
        const category = categories.find(c => c.id === item.categoryId)
        return {
            name: category?.name || 'Uncategorized',
            value: item._sum.amount || 0
        }
    }).filter(item => item.value > 0)

    // Monthly trends (Bar Chart) - Last 6 months
    const last6Months: any[] = []
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        last6Months.push({
            name: d.toLocaleString('default', { month: 'short' }),
            month: d.getMonth(),
            year: d.getFullYear(),
            amt: 0,
            income: 0,
            expense: 0
        })
    }

    for (const monthData of last6Months) {
        const start = new Date(monthData.year, monthData.month, 1)
        const end = new Date(monthData.year, monthData.month + 1, 0, 23, 59, 59, 999)

        const aggregation = await prisma.transaction.groupBy({
            by: ['type'],
            where: {
                userId,
                date: { gte: start, lte: end }
            },
            _sum: { amount: true }
        })

        aggregation.forEach(item => {
            if (item.type === 'EXPENSE') monthData.expense = item._sum.amount || 0
            if (item.type === 'INCOME') monthData.income = item._sum.amount || 0
        })
        monthData.amt = monthData.expense // Using amt for trends (expense) as per snippet
    }

    return {
        totalBalance,
        accounts,
        recentTransactions,
        summary: {
            totalExpense: expenseAggregation._sum.amount || 0,
            totalIncome: incomeAggregation._sum.amount || 0,
        },
        pieData,
        barData: last6Months
    }
}