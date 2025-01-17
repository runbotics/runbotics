import { FeatureKey } from '#/scheduler-database/feature-key/feature-key.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { FeatureKey as FeatureKeyEnum, Role } from 'runbotics-common';
import { Authority } from '#/scheduler-database/authority/authority.entity';

export class ProcessAdditionFK1735574053328 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager
            .insert(FeatureKey, { name: FeatureKeyEnum.PROCESS_ADD_GUEST });

        const newGuestAuthority = await queryRunner.manager.getRepository(Authority)
            .findOneByOrFail({ name: Role.ROLE_GUEST })
            .then(authority => {
                authority.featureKeys = [
                    ...authority.featureKeys.filter(fk => fk.name !== FeatureKeyEnum.PROCESS_ADD),
                    { name: FeatureKeyEnum.PROCESS_ADD_GUEST },
                ];
                return authority;
            });

        await queryRunner.manager.getRepository(Authority)
            .save(newGuestAuthority);


        await queryRunner.manager
            .insert(FeatureKey, { name: FeatureKeyEnum.PROCESS_INSTANCE_READ_ALL });

        const newTenantAdminAuthority = await queryRunner.manager.getRepository(Authority)
            .findOneByOrFail({ name: Role.ROLE_TENANT_ADMIN })
            .then(authority => {
                authority.featureKeys = [
                    ...authority.featureKeys,
                    { name: FeatureKeyEnum.PROCESS_INSTANCE_READ_ALL },
                ];
                return authority;
            });

        await queryRunner.manager.getRepository(Authority)
            .save(newTenantAdminAuthority);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const newGuestAuthority = await queryRunner.manager.getRepository(Authority)
            .findOneByOrFail({ name: Role.ROLE_GUEST })
            .then(authority => {
                authority.featureKeys = [
                    ...authority.featureKeys.filter(fk => fk.name !== FeatureKeyEnum.PROCESS_ADD_GUEST),
                    { name: FeatureKeyEnum.PROCESS_ADD },
                ];
                return authority;
            });

        await queryRunner.manager.getRepository(Authority)
            .save(newGuestAuthority);

        await queryRunner.manager.delete(FeatureKey, FeatureKeyEnum.PROCESS_ADD_GUEST);


        const newTenantAdminAuthority = await queryRunner.manager.getRepository(Authority)
            .findOneByOrFail({ name: Role.ROLE_TENANT_ADMIN })
            .then(authority => {
                authority.featureKeys = [
                    ...authority.featureKeys.filter(fk => fk.name !== FeatureKeyEnum.PROCESS_INSTANCE_READ_ALL)
                ];
                return authority;
            });

        await queryRunner.manager.getRepository(Authority)
            .save(newTenantAdminAuthority);

        await queryRunner.manager.delete(FeatureKey, FeatureKeyEnum.PROCESS_INSTANCE_READ_ALL);
    }

}
