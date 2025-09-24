import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcryptjs';

// Mockujemy zależności
const userServiceMock = {
    findByEmail: vi.fn(),
    findByEmailForAuth: vi.fn(),
    createMsalSsoUser: vi.fn(),
};

const botServiceMock = {
    findByInstallationId: vi.fn(),
    save: vi.fn(),
};

const botSystemServiceMock = {
    findByName: vi.fn(),
};

const botCollectionServiceMock = {
    getById: vi.fn(),
};

const serverConfigServiceMock = {
    secret: 'test_secret',
    requiredBotVersion: '1.0.0',
};

const connectionMock = {
    createQueryRunner: vi.fn(),
};

// Mockujemy bcrypt
vi.mock('bcryptjs', () => ({
    default: {
        compare: vi.fn(),
    },
}));

// Mockujemy jwt
vi.mock('jsonwebtoken', () => ({
    sign: vi.fn(),
    verify: vi.fn(),
    decode: vi.fn(),
}));

describe('AuthService', () => {
    let service: AuthService;

    beforeEach(() => {
        vi.resetAllMocks();
        service = new AuthService(
            userServiceMock as any,
            botServiceMock as any,
            botSystemServiceMock as any,
            botCollectionServiceMock as any,
            serverConfigServiceMock as any,
            connectionMock as any,
            new JwtService({ secret: 'test_secret' }),
        );
    });

    it('authenticate: poprawne dane zwracają token', async () => {
        const user = {
            email: 'x@test.com',
            passwordHash: 'hashed',
            authorities: [{ name: 'ROLE_USER' }],
        };
        userServiceMock.findByEmailForAuth.mockResolvedValue(user);
        (bcrypt.compare as any).mockResolvedValue(true);

        const result = await service.authenticate({ username: 'x@test.com', password: 'pass', rememberMe: false });
        expect(result.idToken).toBeDefined();
    });

    it('authenticate: brak usera rzuca NotFoundException', async () => {
        userServiceMock.findByEmailForAuth.mockResolvedValue(null);
        await expect(service.authenticate({
            username: 'ghost@test.com',
            password: 'x',
            rememberMe: false,
        })).rejects.toThrow(NotFoundException);
    });

    it('authenticate: złe hasło rzuca UnauthorizedException', async () => {
        userServiceMock.findByEmailForAuth.mockResolvedValue({
            email: 'x@test.com',
            passwordHash: 'hashed',
            authorities: [],
        });
        (bcrypt.compare as any).mockResolvedValue(false);

        await expect(service.authenticate({
            username: 'x@test.com',
            password: 'bad',
            rememberMe: false,
        })).rejects.toThrow(UnauthorizedException);
    });
});
