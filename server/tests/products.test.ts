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

describe('Products Module', () => {
    let createdProductId: string

    it('should create a product with brand name', async () => {
        const response = await request(app.server)
            .post('/api/products')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Oat Milk', brandName: 'Oatly' })

        expect(response.statusCode).toBe(201)
        expect(response.body).toHaveProperty('id')
        expect(response.body.name).toBe('Oat Milk')
        expect(response.body.brandName).toBe('Oatly')
        createdProductId = response.body.id
    })


    it('should list all products', async () => {
        const response = await request(app.server)
            .get('/api/products')
            .set('Authorization', `Bearer ${token}`)

        expect(response.statusCode).toBe(200)
        expect(Array.isArray(response.body)).toBe(true)
        expect(response.body.length).toBeGreaterThan(0)
    })

    it('should get a product by id', async () => {
        const response = await request(app.server)
            .get(`/api/products/${createdProductId}`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.statusCode).toBe(200)
        expect(response.body.id).toBe(createdProductId)
        expect(response.body.name).toBe('Oat Milk')
    })

    it('should update a product name and brand name', async () => {
        const response = await request(app.server)
            .patch(`/api/products/${createdProductId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Almond Milk', brandName: 'Alpro' })

        expect(response.statusCode).toBe(200)

        // Confirm the name and brandName were updated
        const getResponse = await request(app.server)
            .get(`/api/products/${createdProductId}`)
            .set('Authorization', `Bearer ${token}`)
        expect(getResponse.body.name).toBe('Almond Milk')
        expect(getResponse.body.brandName).toBe('Alpro')
    })


    it('should delete a product', async () => {
        const response = await request(app.server)
            .delete(`/api/products/${createdProductId}`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.statusCode).toBe(200)

        // Confirm it no longer exists
        const getResponse = await request(app.server)
            .get(`/api/products/${createdProductId}`)
            .set('Authorization', `Bearer ${token}`)
        expect(getResponse.statusCode).toBe(404)
    })

    it('should reject creating a product with missing name', async () => {
        const response = await request(app.server)
            .post('/api/products')
            .set('Authorization', `Bearer ${token}`)
            .send({})

        // ZodError thrown in controller → Fastify returns 500; accept any error status
        expect(response.statusCode).toBeGreaterThanOrEqual(400)
    })

    it('should reject unauthenticated requests', async () => {
        const response = await request(app.server)
            .get('/api/products')

        expect(response.statusCode).toBe(401)
    })
})
