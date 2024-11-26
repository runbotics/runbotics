import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProcessesTabAccess1732517789213 implements MigrationInterface {
    name = 'ProcessesTabAccess1732517789213';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.getRepository('feature_key').insert({ name: 'ALL_PROCESSES_READ' });
        await queryRunner.manager.getRepository('authority_feature_key').insert({ authority: 'ROLE_TENANT_ADMIN', feature_key: 'ALL_PROCESSES_READ' });
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.getRepository('authority_feature_key').delete({ authority: 'ROLE_TENANT_ADMIN', feature_key: 'ALL_PROCESSES_READ' });
        await queryRunner.manager.getRepository('feature_key').delete({ name: 'ALL_PROCESSES_READ' });
    }
}
