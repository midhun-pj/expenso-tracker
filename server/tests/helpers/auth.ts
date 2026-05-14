import request from 'supertest'
import { FastifyInstance } from 'fastify'

export async function createAndLoginUser(
    app: FastifyInstance
) {
    const response = await request(app.server)
        .post('/api/auth/login')
        .send({
            email: 'midhun@example.com',
            password: 'password123',
        })

    return {
        token: response.body.token,
        user: response.body.user,
    }
}