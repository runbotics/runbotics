import { Authority } from '#/scheduler-database/authority/authority.entity';
import { FeatureKey, Role } from 'runbotics-common';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class ActionFeatureKey1725274222207 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const updatedTenantAdmin = await queryRunner.manager.getRepository(Authority)
            .findOneByOrFail({ name: Role.ROLE_TENANT_ADMIN })
            .then(authority => {
                authority.featureKeys = [
                    ...authority.featureKeys,
                    { name: FeatureKey.EXTERNAL_ACTION_READ },
                    { name: FeatureKey.EXTERNAL_ACTION_ADD },
                    { name: FeatureKey.EXTERNAL_ACTION_EDIT },
                    { name: FeatureKey.EXTERNAL_ACTION_DELETE },
                ];
                return authority;
            });

            await queryRunner.manager.save(Authority, updatedTenantAdmin);

        const updatedUser = await queryRunner.manager.getRepository(Authority)
            .findOneByOrFail({ name: Role.ROLE_USER })
            .then(authority => {
                authority.featureKeys = [
                    ...authority.featureKeys,
                    { name: FeatureKey.EXTERNAL_ACTION_READ }
                ];
                return authority;
            });

        await queryRunner.manager.save(Authority, updatedUser);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const featureKeysToDelete = [
            FeatureKey.EXTERNAL_ACTION_READ,
            FeatureKey.EXTERNAL_ACTION_ADD,
            FeatureKey.EXTERNAL_ACTION_EDIT,
            FeatureKey.EXTERNAL_ACTION_DELETE,
        ];

        const updatedTenantAdmin = await queryRunner.manager.getRepository(Authority)
            .findOneByOrFail({ name: Role.ROLE_TENANT_ADMIN })
            .then(authority => ({
                ...authority,
                featureKeys: authority.featureKeys
                    .filter(featureKey => !featureKeysToDelete.includes(featureKey.name))
            }));

        await queryRunner.manager.save(Authority, updatedTenantAdmin);

        const updatedUser = await queryRunner.manager.getRepository(Authority)
            .findOneByOrFail({ name: Role.ROLE_USER })
            .then(authority => ({
                ...authority,
                featureKeys: authority.featureKeys
                    .filter(featureKey => featureKey.name !== FeatureKey.EXTERNAL_ACTION_READ)
            }));

        await queryRunner.manager.save(Authority, updatedUser);
    }

}
