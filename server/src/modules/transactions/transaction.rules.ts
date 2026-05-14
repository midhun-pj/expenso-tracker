export function validateTransfer(
    fromAccountId: string,
    toAccountId: string,
    amount: number
) {
    if (fromAccountId === toAccountId) {
        throw new Error(
            'Cannot transfer to same account'
        )
    }

    if (amount <= 0) {
        throw new Error('Amount must be greater than 0')
    }
}