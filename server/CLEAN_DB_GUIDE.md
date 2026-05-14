# Database Cleanup Script

## Overview
The `clean-db.ts` script removes all data from the SQLite development database (`dev.db`). This is useful for:
- Testing database initialization
- Resetting application state during development
- Cleaning up test data
- Fresh starts without deleting the database file itself

## Usage

### Method 1: Using npm script (recommended)

First, add this line to `package.json` scripts section:
```json
"clean-db": "tsx scripts/clean-db.ts"
```

Then run:
```bash
pnpm clean-db
```

### Method 2: Direct TypeScript execution

```bash
cd server
npx tsx scripts/clean-db.ts
```

### Method 3: Using Node (after building)

```bash
npm run build
node dist/scripts/clean-db.js
```

## What It Deletes

The script deletes all records in the following order (respecting foreign key constraints):

1. **TransactionEntry** - All transaction entries
2. **Transaction** - All transactions (expenses, income, transfers)
3. **Account** - All user accounts (checking, savings, cash, etc.)
4. **Category** - All expense/income categories
5. **Config** - All user configuration settings
6. **User** - All user accounts

## Output

The script provides detailed feedback:

```
🧹 Starting database cleanup...

Deleting TransactionEntry...
✓ Deleted 42 transaction entries

Deleting Transaction...
✓ Deleted 15 transactions

Deleting Account...
✓ Deleted 8 accounts

Deleting Category...
✓ Deleted 12 categories

Deleting Config...
✓ Deleted 3 configs

Deleting User...
✓ Deleted 5 users

✅ Database cleanup completed successfully!

Summary:
  - Users: 5
  - Accounts: 8
  - Categories: 12
  - Transactions: 15
  - Transaction Entries: 42
  - Configs: 3
```

## Important Notes

⚠️ **WARNING**: This script permanently deletes all data from the development database. There is no undo.

✅ **SAFE**: The script only affects data (tables), not the database file structure or migrations.

✅ **REVERSIBLE**: You can restore data by:
- Running database migrations again: `npm run prisma:migrate`
- Reseeding with test data if a seed script exists

## Troubleshooting

### Error: Cannot find module '@prisma/client'
- Ensure you've run `npm install` or `pnpm install`
- Regenerate Prisma client: `npm run prisma:generate`

### Error: DATABASE_URL is not set
- Make sure `.env` file exists in the server folder
- Ensure `DATABASE_URL` is configured properly

### Error: process is not defined
- This should not happen with the updated tsconfig
- Try deleting `node_modules` and reinstalling
- Ensure `@types/node` is in devDependencies

## Development Workflow

Typical development workflow when testing:

```bash
# 1. Clean up old data
pnpm clean-db

# 2. Run migrations if needed
pnpm prisma:migrate

# 3. Start the development server
pnpm dev

# 4. Test your API endpoints
```

## Script Source

Location: `server/scripts/clean-db.ts`

The script uses Prisma ORM to safely delete all data while respecting:
- Foreign key relationships
- Transaction integrity
- Database constraints
