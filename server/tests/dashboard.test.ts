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

describe('Dashboard Module', () => {
    it('should fetch dashboard summary', async () => {
        const response = await request(app.server)
            .get('/api/dashboard/summary')
            .set('Authorization', `Bearer ${token}`)

        expect(response.statusCode).toBe(200)
        expect(response.body.summary).toBeDefined()
        expect(Array.isArray(response.body.pieData)).toBe(true)
        expect(Array.isArray(response.body.barData)).toBe(true)
        expect(response.body.barData.length).toEqual(6)
    })

})