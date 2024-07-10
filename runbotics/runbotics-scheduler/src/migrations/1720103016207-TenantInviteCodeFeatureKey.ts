import { AuthorityEntity } from '#/database/authority/authority.entity';
import { FeatureKeyEntity } from '#/database/feature-key/feature-key.entity';
import { FeatureKey, Role } from 'runbotics-common';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class TenantInviteCodeFeatureKey1720103016207 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager
            .insert(FeatureKeyEntity, [
                { name: FeatureKey.TENANT_GET_ALL_INVITE_CODE },
                { name: FeatureKey.TENANT_CREATE_ALL_INVITE_CODE }
            ]);

        const newAuthority = await queryRunner.manager.getRepository(AuthorityEntity)
            .findOneByOrFail({ name: Role.ROLE_ADMIN })
            .then(authority => {
                authority.featureKeys = [
                    ...authority.featureKeys,
                    { name: FeatureKey.TENANT_GET_ALL_INVITE_CODE },
                    { name: FeatureKey.TENANT_CREATE_ALL_INVITE_CODE }
                ];
                return authority;
            });

        await queryRunner.manager.getRepository(AuthorityEntity)
            .save(newAuthority);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const featureKeysToDelete = [
            FeatureKey.TENANT_GET_ALL_INVITE_CODE,
            FeatureKey.TENANT_CREATE_ALL_INVITE_CODE
        ];

        const authority = await queryRunner.manager.getRepository(AuthorityEntity)
            .findOneByOrFail({ name: Role.ROLE_ADMIN })
            .then(authority => ({
                ...authority,
                featureKeys: authority.featureKeys
                    .filter(featureKey => !featureKeysToDelete.includes(featureKey.name))
            }));

        await queryRunner.manager.save(AuthorityEntity, authority);

        await queryRunner.manager
            .delete(FeatureKeyEntity, [
                { name: FeatureKey.TENANT_GET_ALL_INVITE_CODE },
                { name: FeatureKey.TENANT_CREATE_ALL_INVITE_CODE }
            ]);
    }
}
