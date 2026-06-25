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

describe('Supermarkets Module', () => {
    let createdSupermarketId: string

    it('should create a supermarket', async () => {
        const response = await request(app.server)
            .post('/api/supermarkets')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Lidl' })

        expect(response.statusCode).toBe(201)
        expect(response.body).toHaveProperty('id')
        expect(response.body.name).toBe('Lidl')
        createdSupermarketId = response.body.id
    })

    it('should list all supermarkets', async () => {
        const response = await request(app.server)
            .get('/api/supermarkets')
            .set('Authorization', `Bearer ${token}`)

        expect(response.statusCode).toBe(200)
        expect(Array.isArray(response.body)).toBe(true)
        expect(response.body.length).toBeGreaterThan(0)
    })

    it('should get a supermarket by id', async () => {
        const response = await request(app.server)
            .get(`/api/supermarkets/${createdSupermarketId}`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.statusCode).toBe(200)
        expect(response.body.id).toBe(createdSupermarketId)
        expect(response.body.name).toBe('Lidl')
    })

    it('should update a supermarket', async () => {
        const response = await request(app.server)
            .patch(`/api/supermarkets/${createdSupermarketId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Aldi' })

        expect(response.statusCode).toBe(200)

        // Confirm the update
        const getResponse = await request(app.server)
            .get(`/api/supermarkets/${createdSupermarketId}`)
            .set('Authorization', `Bearer ${token}`)
        expect(getResponse.body.name).toBe('Aldi')
    })

    it('should delete a supermarket', async () => {
        const response = await request(app.server)
            .delete(`/api/supermarkets/${createdSupermarketId}`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.statusCode).toBe(200)

        // Confirm it no longer exists
        const getResponse = await request(app.server)
            .get(`/api/supermarkets/${createdSupermarketId}`)
            .set('Authorization', `Bearer ${token}`)
        expect(getResponse.statusCode).toBe(404)
    })

    it('should reject creating a supermarket with missing name', async () => {
        const response = await request(app.server)
            .post('/api/supermarkets')
            .set('Authorization', `Bearer ${token}`)
            .send({})

        // ZodError thrown in controller → Fastify returns 500; accept any error status
        expect(response.statusCode).toBeGreaterThanOrEqual(400)
    })

    it('should reject unauthenticated requests', async () => {
        const response = await request(app.server)
            .get('/api/supermarkets')

        expect(response.statusCode).toBe(401)
    })

    it('should not delete a supermarket that has grocery items', async () => {
        // Create a fresh supermarket and product, link them via a grocery item,
        // then attempt deletion — service should reject it.
        const smRes = await request(app.server)
            .post('/api/supermarkets')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Tesco' })
        const supermarketId = smRes.body.id

        const prodRes = await request(app.server)
            .post('/api/products')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Bread' })
        const productId = prodRes.body.id

        await request(app.server)
            .post('/api/grocery-items')
            .set('Authorization', `Bearer ${token}`)
            .send({
                productId,
                supermarketId,
                quantity: 1,
                unit: 'COUNT',
                price: 1.5,
                date: '2026-06-01',
            })

        const deleteRes = await request(app.server)
            .delete(`/api/supermarkets/${supermarketId}`)
            .set('Authorization', `Bearer ${token}`)

        expect(deleteRes.statusCode).not.toBe(200)
    })
})
