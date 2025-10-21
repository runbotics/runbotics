import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateWebhookRelations1761027477750 implements MigrationInterface {
    name = 'UpdateWebhookRelations1761027477750';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scheduler"."webhook_payload"
            DROP CONSTRAINT "FK_a8309a649db2d54caa85ee5acac"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."webhook_payload"
            DROP CONSTRAINT "REL_a8309a649db2d54caa85ee5aca"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."webhook_payload"
            DROP COLUMN "client_registration_webhook_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scheduler"."webhook_payload"
            ADD "client_registration_webhook_id" uuid`);
        await queryRunner.query(`ALTER TABLE "scheduler"."webhook_payload"
            ADD CONSTRAINT "REL_a8309a649db2d54caa85ee5aca" UNIQUE ("client_registration_webhook_id")`);
        await queryRunner.query(`ALTER TABLE "scheduler"."webhook_payload"
            ADD CONSTRAINT "FK_a8309a649db2d54caa85ee5acac" FOREIGN KEY ("client_registration_webhook_id") REFERENCES "scheduler"."client_registration_webhook" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
