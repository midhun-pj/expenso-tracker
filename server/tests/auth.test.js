import request from 'supertest';
import { beforeAll, afterAll, describe, expect, it } from 'vitest';
import { buildTestApp } from './helpers/test-app';
let app;
beforeAll(async () => {
    app = await buildTestApp();
    await app.ready();
});
afterAll(async () => {
    await app.close();
});
describe('Auth Module', () => {
    it('should register a user', async () => {
        const response = await request(app.server)
            .post('/api/auth/register')
            .send({
            email: `midhun+${Date.now()}@example.com`,
            password: 'password123',
            name: 'Auth User',
        });
        expect(response.statusCode).toBe(201);
        expect(response.body.token).toBeDefined();
    });
    it('should login user with correct credentials', async () => {
        const response = await request(app.server)
            .post('/api/auth/login')
            .send({
            email: 'midhun@example.com',
            password: 'password123',
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.token).toBeDefined();
    });
    it('should return 400 for invalid email format', async () => {
        const response = await request(app.server)
            .post('/api/auth/login')
            .send({
            email: 'not-an-email',
            password: 'password123',
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe('Bad Request');
        expect(response.body.message).toBeDefined();
        expect(Array.isArray(response.body.message)).toBe(true);
    });
    it('should return 400 for short password', async () => {
        const response = await request(app.server)
            .post('/api/auth/login')
            .send({
            email: 'test@example.com',
            password: 'short',
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe('Bad Request');
        expect(response.body.message).toBeDefined();
        expect(Array.isArray(response.body.message)).toBe(true);
    });
    it('should return 401 for non-existent user', async () => {
        const response = await request(app.server)
            .post('/api/auth/login')
            .send({
            email: 'nonexistent@example.com',
            password: 'password123',
        });
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Invalid email or password');
    });
    it('should return 401 for wrong password', async () => {
        // First register a user
        const testEmail = `testuser+${Date.now()}@example.com`;
        await request(app.server)
            .post('/api/auth/register')
            .send({
            email: testEmail,
            password: 'correctpassword123',
            name: 'Test User',
        });
        // Try to login with wrong password using the same email
        const response = await request(app.server)
            .post('/api/auth/login')
            .send({
            email: testEmail,
            password: 'wrongpassword123',
        });
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Invalid email or password');
    });
});
