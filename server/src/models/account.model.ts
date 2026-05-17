
export const ACCOUNT_TYPES = [
    'CASH',
    'BANK',
    'CREDIT_CARD',
    'SAVINGS',
    'WALLET',
] as const

export type AccountType = (typeof ACCOUNT_TYPES)[number]

export type AccounntRequestPayload = {
    name: string
    type: AccountType
    initialBalance?: number
}