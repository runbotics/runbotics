import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddActiveScheduleProcessColumn1755160527569 implements MigrationInterface {
    name = 'AddActiveScheduleProcessColumn1755160527569';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "schedule_process"
            ADD "active" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "schedule_process"
            DROP COLUMN "active"`);
    }

}
