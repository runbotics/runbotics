import { MigrationInterface, QueryRunner } from "typeorm";

export class AddWebhookConstraints1760443905366 implements MigrationInterface {
    name = 'AddWebhookConstraints1760443905366'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scheduler"."webhook_process_trigger" ADD CONSTRAINT "UQ_361fc7eb7d312aafbec31818e80" UNIQUE ("tenant_id", "webhook_id", "process_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scheduler"."webhook_process_trigger" DROP CONSTRAINT "UQ_361fc7eb7d312aafbec31818e80"`);
    }

}
