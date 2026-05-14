import request from 'supertest'
import { beforeAll, afterAll, describe, expect, it } from 'vitest'

import { buildTestApp } from './helpers/test-app'
import { createAndLoginUser } from './helpers/auth'

let app: any
let token: string
let fromAccountId: string
let toAccountId: string

beforeAll(async () => {
    app = await buildTestApp()
    await app.ready()

    const auth = await createAndLoginUser(app)
    token = auth.token

    const account1 = await request(app.server)
        .post('/api/accounts')
        .set('Authorization', `Bearer ${token}`)
        .send({
            name: 'Wallet',
            type: 'CASH',
        })

    const account2 = await request(app.server)
        .post('/api/accounts')
        .set('Authorization', `Bearer ${token}`)
        .send({
            name: 'Savings',
            type: 'BANK',
        })

    fromAccountId = account1.body.id
    toAccountId = account2.body.id
})

afterAll(async () => {
    await app.close()
})

describe('Transactions Module', () => {
    it('should create expense', async () => {
        const response = await request(app.server)
            .post('/api/transactions/expense')
            .set('Authorization', `Bearer ${token}`)
            .send({
                accountId: fromAccountId,
                amount: 100,
                description: 'Groceries',
            })

        expect(response.statusCode).toBe(201)
    })

    it('should transfer between accounts', async () => {
        const response = await request(app.server)
            .post('/api/transactions/transfer')
            .set('Authorization', `Bearer ${token}`)
            .send({
                fromAccountId,
                toAccountId,
                amount: 50,
            })

        expect(response.statusCode).toBe(201)
    })

    it('should fetch transactions', async () => {
        const response = await request(app.server)
            .get('/api/transactions')
            .set('Authorization', `Bearer ${token}`)

        expect(response.statusCode).toBe(200)
        expect(Array.isArray(response.body)).toBe(true)
    })
})