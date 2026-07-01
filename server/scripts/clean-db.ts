import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanDatabase() {
  try {
    console.log('🧹 Starting database cleanup...\n')

    // Delete all data in the correct order (respecting foreign key constraints)
    console.log('Deleting TransactionEntry...')
    const deletedEntries = await prisma.transactionEntry.deleteMany({})
    console.log(`✓ Deleted ${deletedEntries.count} transaction entries\n`)

    console.log('Deleting Transaction...')
    const deletedTransactions = await prisma.transaction.deleteMany({})
    console.log(`✓ Deleted ${deletedTransactions.count} transactions\n`)

    console.log('Deleting Account...')
    const deletedAccounts = await prisma.account.deleteMany({})
    console.log(`✓ Deleted ${deletedAccounts.count} accounts\n`)

    console.log('Deleting Category...')
    const deletedCategories = await prisma.category.deleteMany({})
    console.log(`✓ Deleted ${deletedCategories.count} categories\n`)

    console.log('Deleting Config...')
    const deletedConfigs = await prisma.config.deleteMany({})
    console.log(`✓ Deleted ${deletedConfigs.count} configs\n`)

    console.log('Deleting users')
    const deletedUsers = await prisma.user.deleteMany({});

    console.log('Deleting supermarket')
    const deletedSupermarket = await prisma.supermarket.deleteMany({});

    console.log('Deleting product')
    const deletedProduct = await prisma.product.deleteMany({});

    console.log('✅ Database cleanup completed successfully!')
    console.log('\nSummary:')
    console.log(`  - Accounts: ${deletedAccounts.count}`)
    console.log(`  - Categories: ${deletedCategories.count}`)
    console.log(`  - Transactions: ${deletedTransactions.count}`)
    console.log(`  - Transaction Entries: ${deletedEntries.count}`)
    console.log(`  - Configs: ${deletedConfigs.count}`)
    console.log('USers', deletedUsers);
    console.log('supermarket', deletedSupermarket);
    console.log('product', deletedProduct);
    
  } catch (error) {
    console.error('❌ Error during database cleanup:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

cleanDatabase()

