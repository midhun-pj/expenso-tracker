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

describe('Ledger Module', () => {
    it('should validate ledger', async () => {
        const response = await request(app.server)
            .get('/api/ledger/validate')
            .set('Authorization', `Bearer ${token}`)

        expect(response.statusCode).toBe(200)
        expect(response.body.valid).toBeDefined()
    })
})