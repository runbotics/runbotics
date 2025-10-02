import { describe, test } from 'vitest';
import { FeatureKeyGuardsMethod } from './featureKey.guard';
import { FeatureKey, IAuthority, IFeatureKey, Role } from 'runbotics-common';

describe('FeatureKeyGuardsMethod', () => {
    test.each([
        [null, null, [FeatureKey.ALL_PROCESSES_READ]],
        [null, null, []],
        [[], null, [FeatureKey.ALL_PROCESSES_READ]],
        [null, [], [FeatureKey.ALL_PROCESSES_READ]],
    ])(
        'should return false when authorities or userFeatureKeys are null',
        (
            authorities: IAuthority[] | null,
            userFeatureKeys: IFeatureKey[] | null,
            requiredKeys: FeatureKey[]
        ) => {
            expect(
                FeatureKeyGuardsMethod.checkFeatureKeyAccess(
                    authorities,
                    userFeatureKeys,
                    requiredKeys
                )
            ).toBe(false);
        }
    );

    test('should handle duplicate feature keys without issues', () => {
        const authorities: IAuthority[] = [
            {
                name: Role.ROLE_USER,
                featureKeys: [{ name: FeatureKey.PROCESS_READ }],
            },
        ];
        const userFeatureKeys: IFeatureKey[] = [
            { name: FeatureKey.PROCESS_READ },
        ];
        const requiredKeys = [FeatureKey.PROCESS_READ];

        expect(
            FeatureKeyGuardsMethod.checkFeatureKeyAccess(
                authorities,
                userFeatureKeys,
                requiredKeys
            )
        ).toBe(true);
    });

    test.each([
        [
            [
                {
                    name: Role.ROLE_ADMIN,
                    featureKeys: [{ name: FeatureKey.CREDENTIALS_PAGE_READ }],
                },
            ],
            [],
            [FeatureKey.CREDENTIALS_PAGE_READ],
        ],
        [
            [
                {
                    name: Role.ROLE_ADMIN,
                    featureKeys: [{ name: FeatureKey.CREDENTIALS_PAGE_READ }],
                },
            ],
            [{ name: FeatureKey.ALL_PROCESSES_READ }],
            [FeatureKey.ALL_PROCESSES_READ],
        ],
        [
            [
                {
                    name: Role.ROLE_ADMIN,
                    featureKeys: [{ name: FeatureKey.CREDENTIALS_PAGE_READ }],
                },
            ],
            [{ name: FeatureKey.ALL_PROCESSES_READ }],
            [FeatureKey.ALL_PROCESSES_READ, FeatureKey.CREDENTIALS_PAGE_READ],
        ],
    ])(
        'should allow access when user has required feature keys',
        (
            authorities: IAuthority[] | null,
            userFeatureKeys: IFeatureKey[] | null,
            requiredKeys: FeatureKey[]
        ) => {
            expect(
                FeatureKeyGuardsMethod.checkFeatureKeyAccess(
                    authorities,
                    userFeatureKeys,
                    requiredKeys
                )
            ).toBe(true);
        }
    );

    test('should deny access when user lacks required feature keys', () => {
        const authorities: IAuthority[] = [
            {
                name: Role.ROLE_ADMIN,
                featureKeys: [{ name: FeatureKey.CREDENTIALS_PAGE_READ }],
            },
        ];
        const userFeatureKeys: IFeatureKey[] = [
            { name: FeatureKey.ALL_PROCESSES_READ },
        ];
        const requiredKeys = [
            FeatureKey.ALL_PROCESSES_READ,
            FeatureKey.CREDENTIALS_PAGE_READ,
            FeatureKey.PROCESS_DELETE,
        ];

        expect(
            FeatureKeyGuardsMethod.checkFeatureKeyAccess(
                authorities,
                userFeatureKeys,
                requiredKeys
            )
        ).toBe(false);
    });
});
