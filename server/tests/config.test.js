import request from 'supertest';
import { beforeAll, afterAll, describe, expect, it } from 'vitest';
import { buildTestApp } from './helpers/test-app';
import { createAndLoginUser } from './helpers/auth';
let app;
let token;
beforeAll(async () => {
    app = await buildTestApp();
    await app.ready();
    const auth = await createAndLoginUser(app);
    token = auth.token;
});
afterAll(async () => {
    await app.close();
});
describe('Config Module', () => {
    // ------------------------------------------------------------------ GET
    describe('GET /api/config', () => {
        it('should return 401 without a token', async () => {
            const response = await request(app.server).get('/api/config');
            expect(response.statusCode).toBe(401);
        });
        it('should return default config when none has been saved', async () => {
            const response = await request(app.server)
                .get('/api/config')
                .set('Authorization', `Bearer ${token}`);
            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchObject({
                currency: expect.any(String),
                themeConfig: {
                    themeName: expect.any(String),
                    navColor: expect.any(String),
                    textColor: expect.any(String),
                    buttonColor: expect.any(String),
                },
            });
        });
    });
    // ----------------------------------------------------------------- POST
    describe('POST /api/config', () => {
        it('should return 401 without a token', async () => {
            const response = await request(app.server)
                .post('/api/config')
                .send({ currency: '€', themeConfig: {} });
            expect(response.statusCode).toBe(401);
        });
        it('should save and return the config', async () => {
            const payload = {
                currency: '€',
                themeConfig: {
                    themeName: 'sunset',
                    navColor: '#fafaf9',
                    textColor: '#1c1917',
                    buttonColor: '#ea580c',
                },
            };
            const response = await request(app.server)
                .post('/api/config')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);
            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchObject({
                currency: '€',
                themeConfig: {
                    themeName: 'sunset',
                    navColor: '#fafaf9',
                    textColor: '#1c1917',
                    buttonColor: '#ea580c',
                },
            });
        });
        it('should persist the saved config on subsequent GET', async () => {
            const response = await request(app.server)
                .get('/api/config')
                .set('Authorization', `Bearer ${token}`);
            expect(response.statusCode).toBe(200);
            expect(response.body.currency).toBe('€');
            expect(response.body.themeConfig.themeName).toBe('sunset');
        });
        it('should update (upsert) on a second POST', async () => {
            const updated = {
                currency: '$',
                themeConfig: {
                    themeName: 'forest',
                    navColor: '#fafafa',
                    textColor: '#171717',
                    buttonColor: '#059669',
                },
            };
            const response = await request(app.server)
                .post('/api/config')
                .set('Authorization', `Bearer ${token}`)
                .send(updated);
            expect(response.statusCode).toBe(200);
            expect(response.body.currency).toBe('$');
            expect(response.body.themeConfig.themeName).toBe('forest');
        });
        it('should reject an invalid payload (missing themeConfig fields)', async () => {
            const response = await request(app.server)
                .post('/api/config')
                .set('Authorization', `Bearer ${token}`)
                .send({ currency: '£', themeConfig: { themeName: 'ocean' } }); // missing navColor etc.
            // Zod parse will throw → Fastify replies with 500 (unhandled) or 400 depending on error handler
            expect(response.statusCode).toBeGreaterThanOrEqual(400);
        });
        it('should reject an empty body', async () => {
            const response = await request(app.server)
                .post('/api/config')
                .set('Authorization', `Bearer ${token}`)
                .send({});
            expect(response.statusCode).toBeGreaterThanOrEqual(400);
        });
    });
});
