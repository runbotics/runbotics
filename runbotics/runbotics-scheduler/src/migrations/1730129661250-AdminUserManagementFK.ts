import { Authority } from '#/scheduler-database/authority/authority.entity';
import { FeatureKey } from '#/scheduler-database/feature-key/feature-key.entity';
import { FeatureKey as FeatureKeyEnum, Role } from 'runbotics-common';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AdminUserManagementFK1730129661250 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add TENANT_READ_USER and assign to TENANT ADMIN
        await queryRunner.manager
            .insert(FeatureKey, { name: FeatureKeyEnum.TENANT_READ_USER });

        const newTenantAdminAuthority = await queryRunner.manager.getRepository(Authority)
            .findOneByOrFail({ name: Role.ROLE_TENANT_ADMIN })
            .then(authority => {
                authority.featureKeys = [
                    ...authority.featureKeys,
                    { name: FeatureKeyEnum.TENANT_READ_USER },
                ];
                return authority;
            });

        await queryRunner.manager.getRepository(Authority)
            .save(newTenantAdminAuthority);

        // Remove TENANT_EDIT_USER from ADMIN
        const newAdminAuthority = await queryRunner.manager
            .getRepository(Authority)
            .findOneByOrFail({ name: Role.ROLE_ADMIN })
            .then((authority) => {
                authority.featureKeys = authority.featureKeys.filter(
                    (fk) => fk.name !== FeatureKeyEnum.TENANT_EDIT_USER
                );
                return authority;
            });

        await queryRunner.manager.getRepository(Authority)
            .save(newAdminAuthority);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const tenantAdminAuthority = await queryRunner.manager
            .getRepository(Authority)
            .findOneByOrFail({ name: Role.ROLE_TENANT_ADMIN })
            .then((authority) => {
                authority.featureKeys = authority.featureKeys.filter(
                    (fk) => fk.name !== FeatureKeyEnum.TENANT_READ_USER
                );
                return authority;
            });

        await queryRunner.manager.getRepository(Authority)
            .save(tenantAdminAuthority);

        await queryRunner.manager
            .delete(FeatureKey, { name: FeatureKeyEnum.TENANT_READ_USER });

        const adminAuthority = await queryRunner.manager.getRepository(Authority)
            .findOneByOrFail({ name: Role.ROLE_ADMIN })
            .then(authority => {
                authority.featureKeys = [
                    ...authority.featureKeys,
                    { name: FeatureKeyEnum.TENANT_EDIT_USER },
                ];
                return authority;
            });

        await queryRunner.manager.getRepository(Authority)
            .save(adminAuthority);
    }
}
