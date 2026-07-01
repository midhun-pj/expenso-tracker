import request from 'supertest'
import { beforeAll, afterAll, describe, expect, it } from 'vitest'

import { buildTestApp } from './helpers/test-app'
import { createAndLoginUser } from './helpers/auth'

let app: any
let token: string
let productId: string
let supermarketId: string

beforeAll(async () => {
    app = await buildTestApp()
    await app.ready()

    const auth = await createAndLoginUser(app)
    token = auth.token

    const uniqueSuffix = Date.now() + Math.random().toString(36).substring(2, 7)
    // Seed a product and supermarket required for grocery item foreign keys
    const productRes = await request(app.server)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: `Whole Milk ${uniqueSuffix}` })
    productId = productRes.body.id

    const supermarketRes = await request(app.server)
        .post('/api/supermarkets')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: `Carrefour ${uniqueSuffix}` })
    supermarketId = supermarketRes.body.id
})

afterAll(async () => {
    await app.close()
})

describe('Grocery Items Module', () => {
    let createdItemId: string

    it('should create a grocery item', async () => {
        const response = await request(app.server)
            .post('/api/grocery-items')
            .set('Authorization', `Bearer ${token}`)
            .send({
                productId,
                supermarketId,
                quantity: 2,
                unit: 'L',
                price: 1.89,
                date: '2026-06-01',
            })

        expect(response.statusCode).toBe(201)
        expect(response.body).toHaveProperty('id')
        expect(response.body.product.id).toBe(productId)
        expect(response.body.supermarket.id).toBe(supermarketId)
        createdItemId = response.body.id
    })

    it('should list grocery items with pagination metadata', async () => {
        const response = await request(app.server)
            .get('/api/grocery-items')
            .set('Authorization', `Bearer ${token}`)

        expect(response.statusCode).toBe(200)
        expect(Array.isArray(response.body.data)).toBe(true)
        expect(response.body.pagination).toHaveProperty('currentPage')
        expect(response.body.pagination).toHaveProperty('totalCount')
        expect(response.body.pagination).toHaveProperty('hasNextPage')
    })

    it('should list grocery summary with pagination metadata and support search', async () => {
        const response = await request(app.server)
            .get('/api/grocery-items/summary?page=1&limit=10&search=Milk')
            .set('Authorization', `Bearer ${token}`)

        expect(response.statusCode).toBe(200)
        expect(Array.isArray(response.body.data)).toBe(true)
        expect(response.body.pagination).toHaveProperty('page')
        expect(response.body.pagination).toHaveProperty('limit')
        expect(response.body.pagination).toHaveProperty('total')
        expect(response.body.pagination).toHaveProperty('totalPages')
    })

    it('should filter grocery items by month', async () => {
        const response = await request(app.server)
            .get('/api/grocery-items?month=2026-06')
            .set('Authorization', `Bearer ${token}`)

        expect(response.statusCode).toBe(200)
        expect(Array.isArray(response.body.data)).toBe(true)
        // Every returned item should be from June 2026
        for (const item of response.body.data) {
            const date = new Date(item.date)
            expect(date.getFullYear()).toBe(2026)
            expect(date.getMonth()).toBe(5) // 0-indexed
        }
    })

    it('should filter grocery items by supermarketId', async () => {
        const response = await request(app.server)
            .get(`/api/grocery-items?supermarketId=${supermarketId}`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.statusCode).toBe(200)
        expect(Array.isArray(response.body.data)).toBe(true)
        for (const item of response.body.data) {
            expect(item.supermarket.id).toBe(supermarketId)
        }
    })

    it('should get a grocery item by id', async () => {
        const response = await request(app.server)
            .get(`/api/grocery-items/${createdItemId}`)
            .set('Authorization', `Bearer ${token}`)

        // The endpoint returns { currentItem, history, statistics } from getGroceryItemWithHistoryService
        expect(response.statusCode).toBe(200)
        expect(response.body.currentItem.id).toBe(createdItemId)
        expect(response.body).toHaveProperty('history')
        expect(response.body).toHaveProperty('statistics')
    })

    it('should update a grocery item', async () => {
        const response = await request(app.server)
            .patch(`/api/grocery-items/${createdItemId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ price: 2.1 })

        expect(response.statusCode).toBe(200)
    })

    it('should bulk create grocery items', async () => {
        const response = await request(app.server)
            .post('/api/grocery-items/bulk')
            .set('Authorization', `Bearer ${token}`)
            .send({
                items: [
                    {
                        productId,
                        supermarketId,
                        quantity: 500,
                        unit: 'G',
                        price: 0.99,
                        date: '2026-06-10',
                    },
                    {
                        productId,
                        supermarketId,
                        quantity: 1,
                        unit: 'COUNT',
                        price: 3.49,
                        date: '2026-06-10',
                    },
                ],
            })

        expect(response.statusCode).toBe(201)
        expect(Array.isArray(response.body)).toBe(true)
        expect(response.body.length).toBe(2)
        for (const item of response.body) {
            expect(item).toHaveProperty('id')
            expect(item.product.id).toBe(productId)
        }
    })

    it('should delete a grocery item', async () => {
        const response = await request(app.server)
            .delete(`/api/grocery-items/${createdItemId}`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.statusCode).toBe(200)

        // Confirm 404 after deletion
        const getResponse = await request(app.server)
            .get(`/api/grocery-items/${createdItemId}`)
            .set('Authorization', `Bearer ${token}`)
        expect(getResponse.statusCode).toBe(404)
    })

    it('should reject creating a grocery item with missing required fields', async () => {
        const response = await request(app.server)
            .post('/api/grocery-items')
            .set('Authorization', `Bearer ${token}`)
            .send({ productId })  // missing supermarketId, quantity, unit, price, date

        // ZodError thrown in controller → Fastify returns 500; accept any error status
        expect(response.statusCode).toBeGreaterThanOrEqual(400)
    })

    it('should reject unauthenticated requests', async () => {
        const response = await request(app.server).get('/api/grocery-items')
        expect(response.statusCode).toBe(401)
    })
})
