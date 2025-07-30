import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddActionBlacklist1753256657357 implements MigrationInterface {
    name = 'AddActionBlacklist1753256657357';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "scheduler"."action_blacklist_actiongroups_enum" AS ENUM('variables', 'general', 'mail', 'browser', 'loop', 'api', 'javascript', 'jiraCloud', 'jiraServer', 'asana', 'google', 'jira', 'file', 'folder', 'csv', 'desktopOfficeActions', 'cloudExcel', 'cloudFile', 'beeOffice', 'sap', 'application', 'desktop', 'excel', 'powerPoint', 'windows', 'visualBasic', 'external')`);
        await queryRunner.query(`CREATE TABLE "scheduler"."action_blacklist"
                                 (
                                     "id"           uuid NOT NULL DEFAULT uuid_generate_v4(),
                                     "actionGroups" "scheduler"."action_blacklist_actiongroups_enum" array,
                                     CONSTRAINT "PK_60641316bd4f594f7fb47800a93" PRIMARY KEY ("id")
                                 )`);
        await queryRunner.query(`INSERT INTO "scheduler"."action_blacklist" ("actionGroups")
                                 VALUES ('{}')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "scheduler"."action_blacklist"`);
        await queryRunner.query(`DROP TYPE "scheduler"."action_blacklist_actiongroups_enum"`);
    }

}
