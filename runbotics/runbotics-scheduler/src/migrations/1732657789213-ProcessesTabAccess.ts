import { Authority } from '#/scheduler-database/authority/authority.entity';
import { FeatureKey } from '#/scheduler-database/feature-key/feature-key.entity';
import { FeatureKey as FeatureKeyEnum, Role } from 'runbotics-common';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProcessesTabAccess1732657789213 implements MigrationInterface {
    name = 'ProcessesTabAccess1732657789213';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.getRepository(FeatureKey).insert({ name: FeatureKeyEnum.ALL_PROCESSES_READ });

        const authorityRepository = await queryRunner.manager.getRepository(Authority);
        const roleTenantAdmin = await authorityRepository.findOneOrFail({ where: { name: Role.ROLE_TENANT_ADMIN } });
        roleTenantAdmin.featureKeys.push({ name: FeatureKeyEnum.ALL_PROCESSES_READ });
        await authorityRepository.save(roleTenantAdmin);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.getRepository(FeatureKey).insert({ name: FeatureKeyEnum.ALL_PROCESSES_READ });
        const authorityRepository = await queryRunner.manager.getRepository(Authority);
        const roleTenantAdmin = await authorityRepository.findOneOrFail({ where: { name: Role.ROLE_TENANT_ADMIN } });
        roleTenantAdmin.featureKeys = roleTenantAdmin.featureKeys.filter(featureKey => featureKey.name !== FeatureKeyEnum.ALL_PROCESSES_READ);
        await authorityRepository.save(roleTenantAdmin);

        await queryRunner.manager.getRepository(FeatureKey).delete({ name: FeatureKeyEnum.ALL_PROCESSES_READ });
    }
}
