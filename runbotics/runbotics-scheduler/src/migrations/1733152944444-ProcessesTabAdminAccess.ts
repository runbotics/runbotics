import { Authority } from '#/scheduler-database/authority/authority.entity';
import { FeatureKey as FeatureKeyEnum, Role } from 'runbotics-common';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProcessesTabAdminAccess1733152944444 implements MigrationInterface {
    name = 'ProcessesTabAdminAccess1733152944444';

    public async up(queryRunner: QueryRunner): Promise<void> {
        const authorityRepository = await queryRunner.manager.getRepository(Authority);
        const roleTenantAdmin = await authorityRepository.findOneOrFail({ where: { name: Role.ROLE_TENANT_ADMIN } });
        roleTenantAdmin.featureKeys.push(
            { name: FeatureKeyEnum.ALL_PROCESSES_READ },
            { name: FeatureKeyEnum.PROCESS_COLLECTION_ALL_ACCESS },
            { name: FeatureKeyEnum.PROCESS_ALL_ACCESS, }
        );
        await authorityRepository.save(roleTenantAdmin);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const authorityRepository = await queryRunner.manager.getRepository(Authority);
        const roleTenantAdmin = await authorityRepository.findOneOrFail({ where: { name: Role.ROLE_TENANT_ADMIN } });
        roleTenantAdmin.featureKeys = roleTenantAdmin.featureKeys.filter(
            featureKey => ![
                FeatureKeyEnum.ALL_PROCESSES_READ,
                FeatureKeyEnum.PROCESS_COLLECTION_ALL_ACCESS,
                FeatureKeyEnum.PROCESS_ALL_ACCESS,
            ].includes(featureKey.name)
        );
        await authorityRepository.save(roleTenantAdmin);
    }
}
