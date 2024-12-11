import { Authority } from '#/scheduler-database/authority/authority.entity';
import { Role, FeatureKey } from 'runbotics-common';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AdminProcessesTabAccess1733815915555 implements MigrationInterface {
    name = 'AdminProcessesTabAccess1733815915555';

    public async up(queryRunner: QueryRunner): Promise<void> {
        const authorityRepository = await queryRunner.manager.getRepository(Authority);
        const roleAdmin = await authorityRepository.findOneOrFail({ where: { name: Role.ROLE_ADMIN } });
        roleAdmin.featureKeys.push(
            { name: FeatureKey.ALL_PROCESSES_READ },
        );
        await authorityRepository.save(roleAdmin);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const authorityRepository = await queryRunner.manager.getRepository(Authority);
        const roleAdmin = await authorityRepository.findOneOrFail({ where: { name: Role.ROLE_ADMIN } });
        roleAdmin.featureKeys = roleAdmin.featureKeys.filter(
            featureKey => FeatureKey.ALL_PROCESSES_READ !== featureKey.name
        );
        await authorityRepository.save(roleAdmin);
    }
}