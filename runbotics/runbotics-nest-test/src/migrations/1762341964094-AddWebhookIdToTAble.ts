import { MigrationInterface, QueryRunner } from "typeorm";

export class AddWebhookIdToTAble1762341964094 implements MigrationInterface {
    name = 'AddWebhookIdToTAble1762341964094'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "runbotics_nest_test"."webhook" ADD "rb_webhook_id" character varying NOT NULL DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "runbotics_nest_test"."webhook" DROP COLUMN "rb_webhook_id"`);
    }

}
