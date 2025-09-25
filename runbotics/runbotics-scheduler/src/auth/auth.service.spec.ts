import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, ForbiddenException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { Guest } from '#/scheduler-database/guest/guest.entity';

// Mockujemy zależności
const userServiceMock = {
    findByEmail: vi.fn(),
    findByEmailForAuth: vi.fn(),
    createMsalSsoUser: vi.fn(),
};

const botServiceMock = { findByInstallationId: vi.fn(), save: vi.fn() };
const botSystemServiceMock = { findByName: vi.fn() };
const botCollectionServiceMock = { getById: vi.fn() };
const serverConfigServiceMock = { secret: 'test_secret', requiredBotVersion: '1.0.0' };
const connectionMock = { createQueryRunner: vi.fn() };

// Mockujemy bcrypt
vi.mock('bcryptjs', () => ({
    default: { compare: vi.fn() },
}));

// Mockujemy jsonwebtoken
vi.mock('jsonwebtoken', () => ({
    sign: vi.fn().mockReturnValue('signed_token'),
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

    // ----------------------------
    // TESTY dla authenticate
    // ----------------------------
    describe('authenticate', () => {
        const baseUser = {
            email: 'x@test.com',
            passwordHash: 'hashed',
            authorities: [{ name: 'ROLE_USER' }],
            tenant: { active: true },
            activated: true,
        };

        it('✅ poprawne dane zwracają token i użytkownika', async () => {
            userServiceMock.findByEmailForAuth.mockResolvedValue(baseUser);
            (bcrypt.compare as any).mockResolvedValue(true);

            const result = await service.authenticate({
                username: 'x@test.com',
                password: 'pass',
                rememberMe: false,
            });

            expect(result.idToken).toBeDefined();
            expect(result.user.email).toBe('x@test.com');
            expect(result.user.passwordHash).toBeUndefined();
            expect(result.user.authorities).toBeUndefined();
        });

        it('🚫 brak usera rzuca NotFoundException', async () => {
            userServiceMock.findByEmailForAuth.mockResolvedValue(null);

            await expect(service.authenticate({
                username: 'ghost@test.com',
                password: 'x',
                rememberMe: false,
            })).rejects.toThrow(NotFoundException);
        });

        it('🚫 tenant nieaktywny rzuca ForbiddenException', async () => {
            const inactiveTenantUser = { ...baseUser, tenant: { active: false } };
            userServiceMock.findByEmailForAuth.mockResolvedValue(inactiveTenantUser);

            await expect(service.authenticate({
                username: 'x@test.com',
                password: 'pass',
                rememberMe: false,
            })).rejects.toThrow(ForbiddenException);
        });

        it('🚫 złe hasło rzuca UnauthorizedException', async () => {
            userServiceMock.findByEmailForAuth.mockResolvedValue(baseUser);
            (bcrypt.compare as any).mockResolvedValue(false);

            await expect(service.authenticate({
                username: 'x@test.com',
                password: 'bad',
                rememberMe: false,
            })).rejects.toThrow(UnauthorizedException);
        });

        it('🚫 nieaktywny użytkownik rzuca ForbiddenException', async () => {
            const notActivatedUser = { ...baseUser, activated: false };
            userServiceMock.findByEmailForAuth.mockResolvedValue(notActivatedUser);
            (bcrypt.compare as any).mockResolvedValue(true);

            await expect(service.authenticate({
                username: 'x@test.com',
                password: 'pass',
                rememberMe: false,
            })).rejects.toThrow(ForbiddenException);
        });

        it('✅ ustawia długi czas ważności tokenu, jeśli rememberMe=true', async () => {
            userServiceMock.findByEmailForAuth.mockResolvedValue(baseUser);
            (bcrypt.compare as any).mockResolvedValue(true);

            const jwtSignSpy = vi.spyOn(service['jwtService'], 'sign');
            await service.authenticate({
                username: 'x@test.com',
                password: 'pass',
                rememberMe: true,
            });

            expect(jwtSignSpy).toHaveBeenCalledWith(
                expect.any(Object),
                expect.objectContaining({ expiresIn: '30d' }),
            );
        });
    });

    // ----------------------------
    // TESTY dla createGuestToken
    // ----------------------------
    describe('createGuestToken', () => {
        const guestUser = {
            email: 'guest@test.com',
            passwordHash: 'hashed',
            authorities: [{ name: 'ROLE_GUEST' }],
            tenant: { active: true },
            activated: true,
        };

        const guest: Guest = {
            id: 'g1',
            ipHash: 'hash',
            executionsCount: 0,
            user: guestUser,
        } as any;

        it('✅ zwraca token i usera bez haseł/authorities', async () => {
            userServiceMock.findByEmailForAuth.mockResolvedValue(guestUser);

            const result = await service.createGuestToken(guest);

            expect(result.idToken).toBeDefined();
            expect(result.user.email).toBe('guest@test.com');
            expect(result.user.passwordHash).toBeUndefined();
            expect(result.user.authorities).toBeUndefined();
        });

        it('🚫 brak usera dla guest rzuca NotFoundException', async () => {
            userServiceMock.findByEmailForAuth.mockResolvedValue(null);

            await expect(service.createGuestToken(guest)).rejects.toThrow(NotFoundException);
        });
    });
});
