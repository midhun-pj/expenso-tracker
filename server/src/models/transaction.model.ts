export interface GetTransactionsQuery {
    page?: number
    limit?: number

    year?: number
    month?: number

    type?: 'EXPENSE' | 'INCOME' | 'TRANSFER'

    categoryId?: string

    accountId?: string

    search?: string
}