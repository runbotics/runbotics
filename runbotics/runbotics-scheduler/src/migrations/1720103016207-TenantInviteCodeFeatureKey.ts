import { Authority } from '#/scheduler-database/authority/authority.entity';
import { FeatureKey } from '#/scheduler-database/feature-key/feature-key.entity';
import { FeatureKey as FeatureKeyEnum, Role } from 'runbotics-common';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class TenantInviteCodeFeatureKey1720103016207 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager
            .insert(FeatureKey, [
                { name: FeatureKeyEnum.TENANT_GET_ALL_INVITE_CODE },
                { name: FeatureKeyEnum.TENANT_CREATE_ALL_INVITE_CODE }
            ]);

        const newAuthority = await queryRunner.manager.getRepository(Authority)
            .findOneByOrFail({ name: Role.ROLE_ADMIN })
            .then(authority => {
                authority.featureKeys = [
                    ...authority.featureKeys,
                    { name: FeatureKeyEnum.TENANT_GET_ALL_INVITE_CODE },
                    { name: FeatureKeyEnum.TENANT_CREATE_ALL_INVITE_CODE }
                ];
                return authority;
            });

        await queryRunner.manager.getRepository(Authority)
            .save(newAuthority);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const featureKeysToDelete = [
            FeatureKeyEnum.TENANT_GET_ALL_INVITE_CODE,
            FeatureKeyEnum.TENANT_CREATE_ALL_INVITE_CODE
        ];

        const authority = await queryRunner.manager.getRepository(Authority)
            .findOneByOrFail({ name: Role.ROLE_ADMIN })
            .then(authority => ({
                ...authority,
                featureKeys: authority.featureKeys
                    .filter(featureKey => !featureKeysToDelete.includes(featureKey.name))
            }));

        await queryRunner.manager.save(Authority, authority);

        await queryRunner.manager
            .delete(FeatureKey, [
                { name: FeatureKeyEnum.TENANT_GET_ALL_INVITE_CODE },
                { name: FeatureKeyEnum.TENANT_CREATE_ALL_INVITE_CODE }
            ]);
    }
}
