import { Authority } from '#/scheduler-database/authority/authority.entity';
import { FeatureKey } from '#/scheduler-database/feature-key/feature-key.entity';
import { FeatureKey as FeatureKeyEnum, Role } from 'runbotics-common';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProcessesTabAdminAccess1733144215000 implements MigrationInterface {
    name = 'ProcessesTabAdminAccess1733144215000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        const authorityRepository = await queryRunner.manager.getRepository(Authority);
        const roleAdmin = await authorityRepository.findOneOrFail({ where: { name: Role.ROLE_ADMIN } });
        roleAdmin.featureKeys.push({ name: FeatureKeyEnum.ALL_PROCESSES_READ });
        await authorityRepository.save(roleAdmin);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const authorityRepository = await queryRunner.manager.getRepository(Authority);
        const roleAdmin = await authorityRepository.findOneOrFail({ where: { name: Role.ROLE_ADMIN } });
        roleAdmin.featureKeys = roleAdmin.featureKeys.filter(featureKey => featureKey.name !== FeatureKeyEnum.ALL_PROCESSES_READ);
        await authorityRepository.save(roleAdmin);
    }
}
