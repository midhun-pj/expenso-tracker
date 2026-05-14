import { PrismaClient } from '@prisma/client'

export async function validateLedger(
    prisma: PrismaClient,
    userId: string
) {
    const accounts = await prisma.account.findMany({
        where: { userId },
    })

    const transactions =
        await prisma.transaction.findMany({
            where: { userId },
            include: {
                entries: true,
            },
        })

    let issues: string[] = []

    for (const tx of transactions) {
        const sum = tx.entries.reduce(
            (acc, e) => acc + e.amount,
            0
        )

        if (sum !== tx.amount) {
            issues.push(
                `Transaction ${tx.id} mismatch: entries=${sum} tx=${tx.amount}`
            )
        }
    }

    return {
        valid: issues.length === 0,
        issues,
        accountsCount: accounts.length,
        transactionsCount: transactions.length,
    }
}