import { Authority } from '#/scheduler-database/authority/authority.entity';
import { FeatureKey } from '#/scheduler-database/feature-key/feature-key.entity';
import { FeatureKey as FeatureKeyEnum, Role } from 'runbotics-common';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class TagFeatureKey1735571296131 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager
            .insert(FeatureKey, { name: FeatureKeyEnum.TAG_CREATE });
        await queryRunner.manager
            .insert(FeatureKey, { name: FeatureKeyEnum.TAG_READ });
        await queryRunner.manager
            .insert(FeatureKey, { name: FeatureKeyEnum.TAG_DELETE });


        const newUserAuthority = await queryRunner.manager.getRepository(Authority)
            .findOneByOrFail({ name: Role.ROLE_USER })
            .then(authority => {
                authority.featureKeys = [
                    ...authority.featureKeys,
                    { name: FeatureKeyEnum.TAG_READ },
                ];
                return authority;
            });

        await queryRunner.manager.getRepository(Authority)
            .save(newUserAuthority);

        const newTenantAdminAuthority = await queryRunner.manager.getRepository(Authority)
            .findOneByOrFail({ name: Role.ROLE_TENANT_ADMIN })
            .then(authority => {
                authority.featureKeys = [
                    ...authority.featureKeys,
                    { name: FeatureKeyEnum.TAG_CREATE },
                    { name: FeatureKeyEnum.TAG_READ },
                    { name: FeatureKeyEnum.TAG_DELETE },
                ];
                return authority;
            });

        await queryRunner.manager.getRepository(Authority)
            .save(newTenantAdminAuthority);

        const newAdminAuthority = await queryRunner.manager.getRepository(Authority)
            .findOneByOrFail({ name: Role.ROLE_ADMIN })
            .then(authority => {
                authority.featureKeys = [
                    ...authority.featureKeys,
                    { name: FeatureKeyEnum.TAG_READ },
                ];
                return authority;
            });

        await queryRunner.manager.getRepository(Authority)
            .save(newAdminAuthority);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const featureKeysToDelete = [
            FeatureKeyEnum.TAG_CREATE,
            FeatureKeyEnum.TAG_READ,
            FeatureKeyEnum.TAG_DELETE
        ];

        const userAuthority = await queryRunner.manager
            .getRepository(Authority)
            .findOneByOrFail({ name: Role.ROLE_USER })
            .then((authority) => {
                authority.featureKeys = authority.featureKeys.filter(
                    (fk) => !featureKeysToDelete.includes(fk.name)
                );
                return authority;
            });

        await queryRunner.manager.getRepository(Authority)
            .save(userAuthority);

        const tenantAdminAuthority = await queryRunner.manager
            .getRepository(Authority)
            .findOneByOrFail({ name: Role.ROLE_USER })
            .then((authority) => {
                authority.featureKeys = authority.featureKeys.filter(
                    (fk) => !featureKeysToDelete.includes(fk.name)
                );
                return authority;
            });

        await queryRunner.manager.getRepository(Authority)
            .save(tenantAdminAuthority);

        const adminAuthority = await queryRunner.manager
            .getRepository(Authority)
            .findOneByOrFail({ name: Role.ROLE_USER })
            .then((authority) => {
                authority.featureKeys = authority.featureKeys.filter(
                    (fk) => !featureKeysToDelete.includes(fk.name)
                );
                return authority;
            });

        await queryRunner.manager.getRepository(Authority)
            .save(adminAuthority);

        await queryRunner.manager
            .delete(FeatureKey, featureKeysToDelete);
    }

}
