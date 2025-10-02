import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthGuestService } from './auth-guest.service';
import bcrypt from 'bcryptjs';
import { DataSource, In } from 'typeorm';
import { Guest } from '#/scheduler-database/guest/guest.entity';
import { User } from '#/scheduler-database/user/user.entity';
import { Role } from 'runbotics-common';
import { Logger } from '#/utils/logger';

vi.mock('bcryptjs');
vi.mock('#/utils/logger');

describe('AuthGuestService', () => {
    let service: AuthGuestService;
    let dataSourceMock: any;

    beforeEach(() => {
        dataSourceMock = {
            manager: {
                find: vi.fn(),
                findOne: vi.fn(),
                save: vi.fn(),
                delete: vi.fn(),
                transaction: vi.fn(),
            },
        };

        (bcrypt.compareSync as any) = vi.fn();
        (bcrypt.hash as any) = vi.fn();

        (Logger as any).mockImplementation(() => ({
            log: vi.fn(),
        }));

        service = new AuthGuestService(dataSourceMock as unknown as DataSource);
    });

    describe('verifyGuestLimit', () => {
        it('should return true if no guest found', async () => {
            dataSourceMock.manager.find.mockResolvedValue([
                { ipHash: 'hash1' },
                { ipHash: 'hash2' },
            ]);
            (bcrypt.compareSync as any).mockReturnValue(false);

            const result = await service.verifyGuestLimit('127.0.0.1');
            expect(result).toBe(true);
            expect(dataSourceMock.manager.find).toHaveBeenCalledWith(Guest);
        });

        it('should return false if guest user found by hashed ip', async () => {
            dataSourceMock.manager.find.mockResolvedValue([
                { ipHash: 'hash1' },
            ]);
            (bcrypt.compareSync as any).mockReturnValue(true);

            const result = await service.verifyGuestLimit('127.0.0.1');
            expect(result).toBe(false);
        });

        it('should serve db error', async () => {
            dataSourceMock.manager.find.mockRejectedValue(new Error('DB error'));

            await expect(service.verifyGuestLimit('127.0.0.1')).rejects.toThrow('DB error');
        });
    });

    describe('createGuestUser', () => {
        it('should create guest user and return it', async () => {
            const mockAuthority = { name: Role.ROLE_GUEST };
            const mockSavedUser = { id: 123, email: 'guest@test.com' };
            const mockGuest: Guest = { ipHash: 'hashed_ip', user: mockSavedUser as User, executionsCount: 0 };

            (bcrypt.hash as any).mockResolvedValue('hashed_ip');
            dataSourceMock.manager.findOne.mockResolvedValue(mockAuthority);

            dataSourceMock.manager.transaction.mockImplementation(async (cb: any) => {
                return cb({
                    findOne: vi.fn().mockResolvedValue(mockAuthority),
                    save: vi
                        .fn()
                        .mockResolvedValueOnce(mockSavedUser) // save user
                        .mockResolvedValueOnce(mockGuest), // save guest
                });
            });

            const result = await service.createGuestUser('127.0.0.1', 'en');
            expect(result).toEqual(mockGuest);
            expect(dataSourceMock.manager.transaction).toHaveBeenCalled();
        });

        it('should throw error if transaction of db manager fail', async () => {
            dataSourceMock.manager.transaction.mockRejectedValue(new Error('Transaction failed'));

            await expect(service.createGuestUser('127.0.0.1', 'en')).rejects.toThrow('Transaction failed');
        });
    });

    describe('deleteOldGuests', () => {
        it('should delete all guest users from db', async () => {
            const guests = [
                { user: { id: 'u1' } },
                { user: { id: 'u2' } },
            ];
            dataSourceMock.manager.find.mockResolvedValue(guests);
            dataSourceMock.manager.delete.mockResolvedValue({ affected: 2 });

            await service.deleteOldGuests();

            expect(dataSourceMock.manager.find).toHaveBeenCalledWith(Guest, { relations: { user: true } });
            expect(dataSourceMock.manager.delete).toHaveBeenCalledWith(User, { id: In(['u1', 'u2']) });
        });

        it('empty guest list doesn\'t throw error, just affect 0 rows', async () => {
            dataSourceMock.manager.find.mockResolvedValue([]);
            dataSourceMock.manager.delete.mockResolvedValue({ affected: 0 });

            await service.deleteOldGuests();

            expect(dataSourceMock.manager.delete).toHaveBeenCalledWith(User, { id: In([]) });
        });

        it('error should be thrown if error occured', async () => {
            dataSourceMock.manager.find.mockResolvedValue([{ user: { id: 'u1' } }]);
            dataSourceMock.manager.delete.mockRejectedValue(new Error('Delete failed'));

            await expect(service.deleteOldGuests()).rejects.toThrow('Delete failed');
        });
    });
});
