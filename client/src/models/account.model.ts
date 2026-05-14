
export const ACCOUNT_TYPES = [
    'CASH',
    'BANK',
    'CREDIT_CARD',
    'SAVINGS',
    'WALLET',
] as const;

export type AccountType = typeof ACCOUNT_TYPES[number];

export interface AccountBase {
    name: string;
    type: AccountType;
    initialBalance?: number;
}

export interface Account extends AccountBase {
    id: string;
    userId?: string;
    createdAt?: string;
}



export type AccountsFormProps = {
    accounts: Account[];

    createAccount: (data: Omit<Account, 'id'>) => Promise<void>;

    deleteAccount: (id: string) => Promise<void>;

    currency: string;
};
