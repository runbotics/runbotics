import { describe, test, expect } from 'vitest';
import { FeatureKey, Role, IAuthority, IFeatureKey } from 'runbotics-common';
import { User } from '#/scheduler-database/user/user.entity';
import {
    getAllFeatureKeysAssignedToUser,
    hasFeatureKeys,
    hasFeatureKey,
} from './user.utils';

describe('user.utils', () => {
    function createTestUser(
        authorities: IAuthority[],
        userFeatureKeys: IFeatureKey[]
    ): User {
        return {
            authorities,
            userFeatureKeys,
        } as User;
    }

    describe('getAllFeatureKeysAssignedToUser', () => {
        test('should return empty array when both authorities and userFeatureKeys are empty', () => {
            const result = getAllFeatureKeysAssignedToUser([], []);

            expect(result).toEqual([]);
        });

        test('should return feature keys from authorities only', () => {
            const authorities: IAuthority[] = [
                {
                    name: Role.ROLE_USER,
                    featureKeys: [
                        { name: FeatureKey.PROCESS_READ },
                        { name: FeatureKey.HISTORY_READ },
                    ],
                },
            ];

            const result = getAllFeatureKeysAssignedToUser(authorities, []);

            expect(result).toEqual([
                FeatureKey.PROCESS_READ,
                FeatureKey.HISTORY_READ,
            ]);
        });

        test('should return feature keys from userFeatureKeys only', () => {
            const userFeatureKeys: IFeatureKey[] = [
                { name: FeatureKey.AI_ASSISTANTS_ACCESS },
                { name: FeatureKey.PROCESS_ALL_ACCESS },
            ];

            const result = getAllFeatureKeysAssignedToUser([], userFeatureKeys);

            expect(result).toEqual([
                FeatureKey.AI_ASSISTANTS_ACCESS,
                FeatureKey.PROCESS_ALL_ACCESS,
            ]);
        });

        test('should combine feature keys from both authorities and userFeatureKeys', () => {
            const authorities: IAuthority[] = [
                {
                    name: Role.ROLE_USER,
                    featureKeys: [
                        { name: FeatureKey.PROCESS_READ },
                        { name: FeatureKey.HISTORY_READ },
                    ],
                },
            ];
            const userFeatureKeys: IFeatureKey[] = [
                { name: FeatureKey.AI_ASSISTANTS_ACCESS },
                { name: FeatureKey.PROCESS_ALL_ACCESS },
            ];

            const result = getAllFeatureKeysAssignedToUser(
                authorities,
                userFeatureKeys
            );

            expect(result).toContain(FeatureKey.PROCESS_READ);
            expect(result).toContain(FeatureKey.HISTORY_READ);
            expect(result).toContain(FeatureKey.AI_ASSISTANTS_ACCESS);
            expect(result).toContain(FeatureKey.PROCESS_ALL_ACCESS);
            expect(result).toHaveLength(4);
        });

        test('should remove duplicate feature keys from authorities and userFeatureKeys', () => {
            const authorities: IAuthority[] = [
                {
                    name: Role.ROLE_USER,
                    featureKeys: [
                        { name: FeatureKey.PROCESS_READ },
                        { name: FeatureKey.HISTORY_READ },
                    ],
                },
            ];
            const userFeatureKeys: IFeatureKey[] = [
                { name: FeatureKey.PROCESS_READ },
                { name: FeatureKey.AI_ASSISTANTS_ACCESS },
            ];

            const result = getAllFeatureKeysAssignedToUser(
                authorities,
                userFeatureKeys
            );

            expect(result).toEqual([
                FeatureKey.PROCESS_READ,
                FeatureKey.HISTORY_READ,
                FeatureKey.AI_ASSISTANTS_ACCESS,
            ]);
            expect(result).toHaveLength(3);
        });
    });

    describe('hasFeatureKeys', () => {
        test('should return true when user has all required feature keys', () => {
            const user = createTestUser(
                [
                    {
                        name: Role.ROLE_USER,
                        featureKeys: [
                            { name: FeatureKey.PROCESS_READ },
                            { name: FeatureKey.HISTORY_READ },
                        ],
                    },
                ],
                [{ name: FeatureKey.AI_ASSISTANTS_ACCESS }]
            );

            const result = hasFeatureKeys(user, [
                FeatureKey.PROCESS_READ,
                FeatureKey.AI_ASSISTANTS_ACCESS,
            ]);

            expect(result).toBe(true);
        });

        test('should return false when user lacks some required keys', () => {
            const user = createTestUser(
                [
                    {
                        name: Role.ROLE_USER,
                        featureKeys: [{ name: FeatureKey.PROCESS_READ }],
                    },
                ],
                []
            );

            const result = hasFeatureKeys(user, [
                FeatureKey.PROCESS_READ,
                FeatureKey.HISTORY_READ,
            ]);

            expect(result).toBe(false);
        });

        test('should return true when no keys are required (empty array)', () => {
            const user = createTestUser([], []);

            const result = hasFeatureKeys(user, []);

            expect(result).toBe(true);
        });

        test('should return false when user has no feature keys but keys are required', () => {
            const user = createTestUser([], []);

            const result = hasFeatureKeys(user, [FeatureKey.PROCESS_READ]);

            expect(result).toBe(false);
        });

        test('should return true when user has required key from authority only', () => {
            const user = createTestUser(
                [
                    {
                        name: Role.ROLE_ADMIN,
                        featureKeys: [{ name: FeatureKey.HISTORY_READ }],
                    },
                ],
                []
            );

            const result = hasFeatureKeys(user, [FeatureKey.HISTORY_READ]);

            expect(result).toBe(true);
        });

        test('should return true when user has required key from userFeatureKeys only', () => {
            const user = createTestUser(
                [],
                [{ name: FeatureKey.AI_ASSISTANTS_ACCESS }]
            );

            const result = hasFeatureKeys(user, [
                FeatureKey.AI_ASSISTANTS_ACCESS,
            ]);

            expect(result).toBe(true);
        });

        test('should handle duplicate keys correctly', () => {
            const user = createTestUser(
                [
                    {
                        name: Role.ROLE_USER,
                        featureKeys: [{ name: FeatureKey.PROCESS_READ }],
                    },
                ],
                [{ name: FeatureKey.PROCESS_READ }]
            );

            const result = hasFeatureKeys(user, [FeatureKey.PROCESS_READ]);

            expect(result).toBe(true);
        });

        test('should return false when user has some but not all required keys', () => {
            const user = createTestUser(
                [
                    {
                        name: Role.ROLE_USER,
                        featureKeys: [{ name: FeatureKey.PROCESS_READ }],
                    },
                ],
                [{ name: FeatureKey.AI_ASSISTANTS_ACCESS }]
            );

            const result = hasFeatureKeys(user, [
                FeatureKey.PROCESS_READ,
                FeatureKey.AI_ASSISTANTS_ACCESS,
                FeatureKey.HISTORY_READ,
            ]);

            expect(result).toBe(false);
        });
    });

    describe('hasFeatureKey', () => {
        test('should return true when user has the required feature key from authority', () => {
            const user = createTestUser(
                [
                    {
                        name: Role.ROLE_USER,
                        featureKeys: [{ name: FeatureKey.PROCESS_READ }],
                    },
                ],
                []
            );

            const result = hasFeatureKey(user, FeatureKey.PROCESS_READ);

            expect(result).toBe(true);
        });

        test('should return true when user has the required feature key from userFeatureKeys', () => {
            const user = createTestUser(
                [],
                [{ name: FeatureKey.AI_ASSISTANTS_ACCESS }]
            );

            const result = hasFeatureKey(user, FeatureKey.AI_ASSISTANTS_ACCESS);

            expect(result).toBe(true);
        });

        test('should return false when user does not have the required feature key', () => {
            const user = createTestUser(
                [
                    {
                        name: Role.ROLE_USER,
                        featureKeys: [{ name: FeatureKey.PROCESS_READ }],
                    },
                ],
                [{ name: FeatureKey.AI_ASSISTANTS_ACCESS }]
            );

            const result = hasFeatureKey(user, FeatureKey.HISTORY_READ);

            expect(result).toBe(false);
        });

        test('should return false when user has no feature keys', () => {
            const user = createTestUser([], []);

            const result = hasFeatureKey(user, FeatureKey.PROCESS_READ);

            expect(result).toBe(false);
        });

        test('should return true when user has the key in both authorities and userFeatureKeys', () => {
            const user = createTestUser(
                [
                    {
                        name: Role.ROLE_USER,
                        featureKeys: [{ name: FeatureKey.PROCESS_READ }],
                    },
                ],
                [{ name: FeatureKey.PROCESS_READ }]
            );

            const result = hasFeatureKey(user, FeatureKey.PROCESS_READ);

            expect(result).toBe(true);
        });
    });
});
