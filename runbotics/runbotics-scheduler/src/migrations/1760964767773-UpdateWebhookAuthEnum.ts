import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateWebhookAuthEnum1760964767773 implements MigrationInterface {
    name = 'UpdateWebhookAuthEnum1760964767773'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "scheduler"."IDX_878ac3a0935f61949111cbda05"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."client_registration_webhook" DROP COLUMN "client_registration_auth_id"`);
        await queryRunner.query(`ALTER TYPE "scheduler"."webhook_authorization_type_enum" RENAME TO "webhook_authorization_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "scheduler"."webhook_authorization_type_enum" AS ENUM('none', 'basic', 'jwt')`);
        await queryRunner.query(`ALTER TABLE "scheduler"."webhook_authorization" ALTER COLUMN "type" TYPE "scheduler"."webhook_authorization_type_enum" USING "type"::"text"::"scheduler"."webhook_authorization_type_enum"`);
        await queryRunner.query(`DROP TYPE "scheduler"."webhook_authorization_type_enum_old"`);
        await queryRunner.query(`CREATE INDEX "IDX_4a5df04b1f52c5cddc1e4400c4" ON "scheduler"."client_registration_webhook" ("client_authorization_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "scheduler"."IDX_4a5df04b1f52c5cddc1e4400c4"`);
        await queryRunner.query(`CREATE TYPE "scheduler"."webhook_authorization_type_enum_old" AS ENUM('jwt')`);
        await queryRunner.query(`ALTER TABLE "scheduler"."webhook_authorization" ALTER COLUMN "type" TYPE "scheduler"."webhook_authorization_type_enum_old" USING "type"::"text"::"scheduler"."webhook_authorization_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "scheduler"."webhook_authorization_type_enum"`);
        await queryRunner.query(`ALTER TYPE "scheduler"."webhook_authorization_type_enum_old" RENAME TO "webhook_authorization_type_enum"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."client_registration_webhook" ADD "client_registration_auth_id" uuid`);
        await queryRunner.query(`CREATE INDEX "IDX_878ac3a0935f61949111cbda05" ON "scheduler"."client_registration_webhook" ("client_registration_auth_id") `);
    }

}
