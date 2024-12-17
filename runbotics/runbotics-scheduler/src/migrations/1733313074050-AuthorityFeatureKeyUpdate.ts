import { MigrationInterface, QueryRunner } from 'typeorm';

export class AuthorityFeatureKeyUpdate1733313074050 implements MigrationInterface {
    name = 'AuthorityFeatureKeyUpdate1733313074050';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            UPDATE "feature_key"
            SET "name" = 'MANAGE_INACTIVE_USERS'
            WHERE "name" = 'USERS_PAGE_READ'
        `);

        await queryRunner.query(`
            UPDATE "feature_key"
            SET "name" = 'MANAGE_ALL_TENANTS'
            WHERE "name" = 'TENANT_ALL_ACCESS'
        `);

        await queryRunner.query(`
            INSERT INTO "authority_feature_key" ("authority", "feature_key")
            VALUES
                ('ROLE_TENANT_ADMIN', 'SCHEDULER_PAGE_READ'),
                ('ROLE_TENANT_ADMIN', 'HISTORY_READ'),
                ('ROLE_TENANT_ADMIN', 'SCHEDULER_JOBS_READ'),
                ('ROLE_TENANT_ADMIN', 'SCHEDULER_JOBS_DELETE'),
                ('ROLE_TENANT_ADMIN', 'PROCESS_IS_TRIGGERABLE_EDIT'),
                ('ROLE_TENANT_ADMIN', 'PROCESS_IS_TRIGGERABLE_READ'),
                ('ROLE_TENANT_ADMIN', 'BOT_COLLECTION_ALL_ACCESS')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            UPDATE "feature_key"
            SET "name" = 'USERS_PAGE_READ'
            WHERE "name" = 'MANAGE_INACTIVE_USERS'
        `);

        await queryRunner.query(`
            UPDATE "feature_key"
            SET "name" = 'MANAGE_ALL_TENANTS'
            WHERE "name" = 'MANAGE_ALL_TENANTS'
        `);

        await queryRunner.query(`
            DELETE FROM "authority_feature_key"
            WHERE "authority" = 'ROLE_TENANT_ADMIN' AND "feature_key" IN (
                'SCHEDULER_PAGE_READ',
                'HISTORY_READ',
                'SCHEDULER_JOBS_READ',
                'SCHEDULER_JOBS_DELETE',
                'PROCESS_IS_TRIGGERABLE_EDIT',
                'PROCESS_IS_TRIGGERABLE_READ',
                'BOT_COLLECTION_ALL_ACCESS'
            )
        `);
    }

}
