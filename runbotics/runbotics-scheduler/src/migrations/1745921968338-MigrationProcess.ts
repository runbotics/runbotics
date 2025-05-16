import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrationProcess1745921968338 implements MigrationInterface {
    name = 'MigrationProcess1745921968338';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "notification_process" DROP CONSTRAINT "UQ_1c614e65e2b3d2887977548f469"');
        await queryRunner.query('ALTER TABLE "notification_process" ADD "email" character varying(256) NOT NULL DEFAULT \'\'');
        await queryRunner.query('ALTER TABLE "notification_process" ADD CONSTRAINT "UQ_57170ae399baf54bd08c709b2bf" UNIQUE ("email", "user_id", "process_id", "type")');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "notification_process" DROP CONSTRAINT "UQ_57170ae399baf54bd08c709b2bf"');
        await queryRunner.query('ALTER TABLE "notification_process" DROP COLUMN "email"');
        await queryRunner.query('ALTER TABLE "notification_process" ADD CONSTRAINT "UQ_1c614e65e2b3d2887977548f469" UNIQUE ("user_id", "process_id", "type")');
    }

}
