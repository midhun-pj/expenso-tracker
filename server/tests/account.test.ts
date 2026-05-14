import request from 'supertest'
import { beforeAll, afterAll, describe, expect, it } from 'vitest'

import { buildTestApp } from './helpers/test-app'
import { createAndLoginUser } from './helpers/auth'

let app: any
let token: string

beforeAll(async () => {
    app = await buildTestApp()
    await app.ready()

    const auth = await createAndLoginUser(app)
    token = auth.token
})

afterAll(async () => {
    await app.close()
})

describe('Accounts Module', () => {
    it('should create account', async () => {
        const response = await request(app.server)
            .post('/api/accounts')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Main Bank',
                type: 'BANK',
            })

        expect(response.statusCode).toBe(201)
        expect(response.body.name).toBe('Main Bank')
    })
    it('should create account with initial balance', async () => {
        const response = await request(app.server)
            .post('/api/accounts')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Savings bank',
                type: 'SAVINGS',
                initialBalance: 10000,
            })

        expect(response.statusCode).toBe(201)
        expect(response.body.name).toBe('Savings bank')
        expect(response.body.balance).toBe(10000)
    })

    it('should fetch accounts', async () => {
        const response = await request(app.server)
            .get('/api/accounts')
            .set('Authorization', `Bearer ${token}`)

        console.log(response.body)

        expect(response.statusCode).toBe(200)
        expect(Array.isArray(response.body)).toBe(true)
    })
})