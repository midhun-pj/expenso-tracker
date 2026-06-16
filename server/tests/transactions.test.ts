import request from 'supertest'
import { beforeAll, afterAll, describe, expect, it } from 'vitest'

import { buildTestApp } from './helpers/test-app'
import { createAndLoginUser } from './helpers/auth'

let app: any
let token: string
let fromAccountId: string
let toAccountId: string
let categoryId: string

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

  const category = await request(app.server)
    .post('/api/categories')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'Groceries',
      type: 'EXPENSE',
    })
  categoryId = category.body.id
})

afterAll(async () => {
  await app.close()
})

describe('Transactions Module', () => {
  let createdTransactionId: string

  it('should create expense', async () => {
    const response = await request(app.server)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        accountId: fromAccountId,
        amount: 100,
        categoryId: categoryId,
        description: 'Groceries',
        type: 'EXPENSE',
      })

    expect(response.statusCode).toBe(201)
    createdTransactionId = response.body.id

    // Verify account balance has decreased by 100
    const accountsRes = await request(app.server).get('/api/accounts').set('Authorization', `Bearer ${token}`)
    const wallet = accountsRes.body.find((a: any) => a.id === fromAccountId)
    expect(Number(wallet.balance)).toBe(-100)
  })

  it('should update expense and adjust balance correctly', async () => {
    const response = await request(app.server)
      .put(`/api/transactions/${createdTransactionId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        accountId: toAccountId, // Change account
        amount: 150, // Change amount
        type: 'EXPENSE',
        categoryId: categoryId,
        description: 'Groceries Updated',
      })

    expect(response.statusCode).toBe(200)

    // Verify old account restored its balance (+100) -> 0
    const accountsRes = await request(app.server).get('/api/accounts').set('Authorization', `Bearer ${token}`)
    const wallet = accountsRes.body.find((a: any) => a.id === fromAccountId)
    expect(Number(wallet.balance)).toBe(0)

    // Verify new account decremented by 150 -> -150
    const savings = accountsRes.body.find((a: any) => a.id === toAccountId)
    expect(Number(savings.balance)).toBe(-150)
  })

  it('should delete expense and revert balance', async () => {
    const response = await request(app.server)
      .delete(`/api/transactions/${createdTransactionId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)

    // Verify account balance was restored (+150) -> 0
    const accountsRes = await request(app.server).get('/api/accounts').set('Authorization', `Bearer ${token}`)
    const savings = accountsRes.body.find((a: any) => a.id === toAccountId)
    expect(Number(savings.balance)).toBe(0)
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

    const accountsRes = await request(app.server).get('/api/accounts').set('Authorization', `Bearer ${token}`)
    const wallet = accountsRes.body.find((a: any) => a.id === fromAccountId)
    const savings = accountsRes.body.find((a: any) => a.id === toAccountId)
    expect(Number(wallet.balance)).toBe(-50)
    expect(Number(savings.balance)).toBe(50)
  })

  it('should fetch transactions', async () => {
    const response = await request(app.server)
      .get('/api/transactions')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.body.data)).toBe(true)
  })
});
