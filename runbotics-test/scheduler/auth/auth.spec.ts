import { test, expect, request } from '@playwright/test';

const BASE_URL = 'http://localhost:7777'; 

test.describe('AuthController (E2E)', () => {
    let api;

    test.beforeAll(async ({ playwright }) => {
        api = await request.newContext({ baseURL: BASE_URL });
    });

    test('✅ /auth/login powinno zwrócić JWT dla poprawnych danych', async () => {
        const res = await api.post('/auth/login', {
            data: { email: 'tenant-admin@localhost', password: 'tenant-admin' },
        });

        expect(res.status()).toBe(201);
        const body = await res.json();
        expect(body.access_token).toBeDefined();
    });

    test('❌ /auth/login złe hasło → Unauthorized', async () => {
        const res = await api.post('/auth/login', {
            data: { email: 'tenant-admin@localhost', password: 'wrong' },
        });

        expect(res.status()).toBe(401);
        const body = await res.json();
        expect(body.message).toContain('Unauthorized');
    });

    test('❌ /auth/login user nie istnieje → Unauthorized', async () => {
        const res = await api.post('/auth/login', {
            data: { email: 'ghost@x.com', password: '123' },
        });

        expect(res.status()).toBe(401);
        const body = await res.json();
        expect(body.message).toContain('not found');
    });

    test('❌ /auth/login user nieaktywny → Unauthorized', async () => {
        const res = await api.post('/auth/login', {
            data: { email: 'test-inactive@localhost', password: '1234QWERasdf' },
        });

        expect(res.status()).toBe(401);
        const body = await res.json();
        expect(body.message).toContain('not activated');
    });
    

    test.afterAll(async () => {
        await api.dispose();
    });
});
