import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewFieldForWebhooks1761817329071 implements MigrationInterface {
    name = 'AddNewFieldForWebhooks1761817329071'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "scheduler"."client_registration_webhook_applicationrequesttype_enum" AS ENUM('GET', 'POST', 'PUT', 'PATCH')`);
        await queryRunner.query(`ALTER TABLE "scheduler"."client_registration_webhook" ADD "applicationRequestType" "scheduler"."client_registration_webhook_applicationrequesttype_enum" NOT NULL DEFAULT 'GET'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scheduler"."client_registration_webhook" DROP COLUMN "applicationRequestType"`);
        await queryRunner.query(`DROP TYPE "scheduler"."client_registration_webhook_applicationrequesttype_enum"`);
    }

}
