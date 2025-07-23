import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddActionBlacklist1753256657357 implements MigrationInterface {
    name = 'AddActionBlacklist1753256657357';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification_bot"
            DROP CONSTRAINT "UQ_a9f3eee9f6a2453f091f954bb04"`);
        await queryRunner.query(`ALTER TABLE "notification_process"
            DROP CONSTRAINT "UQ_57170ae399baf54bd08c709b2bf"`);
        await queryRunner.query(`CREATE TYPE "scheduler"."action_blacklist_actiongroups_enum" AS ENUM('variables', 'general', 'mail', 'browser', 'loop', 'api', 'javascript', 'jiraCloud', 'jiraServer', 'asana', 'google', 'jira', 'file', 'folder', 'csv', 'desktopOfficeActions', 'cloudExcel', 'cloudFile', 'beeOffice', 'sap', 'application', 'desktop', 'excel', 'powerPoint', 'windows', 'visualBasic', 'external')`);
        await queryRunner.query(`CREATE TABLE "scheduler"."action_blacklist"
                                 (
                                     "id"           uuid NOT NULL DEFAULT uuid_generate_v4(),
                                     "actionGroups" "scheduler"."action_blacklist_actiongroups_enum" array,
                                     CONSTRAINT "PK_60641316bd4f594f7fb47800a93" PRIMARY KEY ("id")
                                 )`);
        await queryRunner.query(`ALTER TABLE "notification_bot"
            ADD CONSTRAINT "UQ_b8b575c69f8347112093d2aa172" UNIQUE ("custom_email", "user_id", "bot_id", "type")`);
        await queryRunner.query(`ALTER TABLE "notification_process"
            ADD CONSTRAINT "UQ_bb7a57833fbb3b1a80e10ead592" UNIQUE ("custom_email", "user_id", "process_id", "type")`);
        await queryRunner.query(`INSERT INTO "scheduler"."action_blacklist" ("actionGroups")
                                 VALUES ('{}')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification_process"
            DROP CONSTRAINT "UQ_bb7a57833fbb3b1a80e10ead592"`);
        await queryRunner.query(`ALTER TABLE "notification_bot"
            DROP CONSTRAINT "UQ_b8b575c69f8347112093d2aa172"`);
        await queryRunner.query(`DROP TABLE "scheduler"."action_blacklist"`);
        await queryRunner.query(`DROP TYPE "scheduler"."action_blacklist_actiongroups_enum"`);
        await queryRunner.query(`ALTER TABLE "notification_process"
            ADD CONSTRAINT "UQ_57170ae399baf54bd08c709b2bf" UNIQUE ("user_id", "process_id", "type", "custom_email")`);
        await queryRunner.query(`ALTER TABLE "notification_bot"
            ADD CONSTRAINT "UQ_a9f3eee9f6a2453f091f954bb04" UNIQUE ("user_id", "bot_id", "type", "custom_email")`);
    }

}
