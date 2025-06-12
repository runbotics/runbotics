import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExternalActionsPrimaryColumnChange1749207761420 implements MigrationInterface {
    name = 'ExternalActionsPrimaryColumnChange1749207761420';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "action" DROP CONSTRAINT "UQ_ef450ee548dec2dd808b1e5e9d3"');
        await queryRunner.query('ALTER TABLE "action" DROP CONSTRAINT "actionPK"');
        await queryRunner.query('ALTER TABLE "action" ADD CONSTRAINT "actionPK" PRIMARY KEY ("id", "tenant_id")');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "action" DROP CONSTRAINT "actionPK"');
        await queryRunner.query('ALTER TABLE "action" ADD CONSTRAINT "actionPK" PRIMARY KEY ("id")');
        await queryRunner.query('ALTER TABLE "action" ADD CONSTRAINT "UQ_ef450ee548dec2dd808b1e5e9d3" UNIQUE ("id", "tenant_id")');
    }

}
