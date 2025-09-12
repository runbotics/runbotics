import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddZipActionToActionBlacklistEnum1757682784142
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TYPE runbotics.scheduler.action_blacklist_actiongroups_enum ADD VALUE 'zip'`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        UPDATE "scheduler"."action_blacklist" 
        SET "actionGroups" = array_remove("actionGroups", 'zip'::scheduler.action_blacklist_actiongroups_enum)
        WHERE 'zip' = ANY("actionGroups")
        `);

        await queryRunner.query(
            `ALTER TYPE "scheduler"."action_blacklist_actiongroups_enum" RENAME TO "action_blacklist_actiongroups_enum_old"`
        );

        await queryRunner.query(
            `CREATE TYPE "scheduler"."action_blacklist_actiongroups_enum" AS ENUM('variables', 'general', 'mail', 'browser', 'loop', 'api', 'javascript', 'jiraCloud', 'jiraServer', 'asana', 'google', 'jira', 'file', 'folder', 'csv', 'desktopOfficeActions', 'cloudExcel', 'cloudFile', 'beeOffice', 'sap', 'application', 'desktop', 'excel', 'powerPoint', 'windows', 'visualBasic', 'external')`
        );

        await queryRunner.query(
            `ALTER TABLE "scheduler"."action_blacklist" ALTER COLUMN "actionGroups" TYPE "scheduler"."action_blacklist_actiongroups_enum"[] USING "actionGroups"::text::"scheduler"."action_blacklist_actiongroups_enum"[]`
        );

        await queryRunner.query(
            `DROP TYPE "scheduler"."action_blacklist_actiongroups_enum_old"`
        );
    }
}
