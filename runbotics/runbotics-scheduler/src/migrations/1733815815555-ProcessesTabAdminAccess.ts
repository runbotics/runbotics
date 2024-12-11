import { MigrationInterface, QueryRunner } from 'typeorm';
import { FeatureKey as FeatureKeyEnum, Role } from 'runbotics-common';
import { Authority } from '#/scheduler-database/authority/authority.entity';

export class ProcessesTabAdminAccess1733815815555 implements MigrationInterface {
    name = 'ProcessesTabAdminAccess1733815815555 ';

    public async up(queryRunner: QueryRunner): Promise<void> {
        const authorityRepository = await queryRunner.manager.getRepository(Authority);
        const roleAdmin = await authorityRepository.findOneOrFail({ where: { name: Role.ROLE_ADMIN } });
        roleAdmin.featureKeys.push(
            { name: FeatureKeyEnum.ALL_PROCESSES_READ },
        );
        await authorityRepository.save(roleAdmin);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const authorityRepository = await queryRunner.manager.getRepository(Authority);
        const roleAdmin = await authorityRepository.findOneOrFail({ where: { name: Role.ROLE_ADMIN } });
        roleAdmin.featureKeys = roleAdmin.featureKeys.filter(
            featureKey => FeatureKeyEnum.ALL_PROCESSES_READ !== featureKey.name
        );
        await authorityRepository.save(roleAdmin);
    }
}
