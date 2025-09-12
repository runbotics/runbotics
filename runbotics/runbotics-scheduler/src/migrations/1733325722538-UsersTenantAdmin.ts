import { DEFAULT_TENANT_ID } from '#/utils/tenant.utils';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class UsersTenantAdmin1733325722538 implements MigrationInterface {
    name = 'UsersTenantAdmin1733325722538';

    public async up(queryRunner: QueryRunner): Promise<void> {
        const usersCount = await queryRunner.query(`
            SELECT COUNT(*) as count FROM "jhi_user"
            WHERE "id" = 4
        `);
        if (usersCount[0].count != 0) {
            throw new Error('User with id (4) already exists');
        }

        await queryRunner.query(`
            INSERT INTO "jhi_user" ("id", "email", "password_hash", "first_name", "last_name", "activated", "lang_key", "created_by", "last_modified_by", "tenant_id")
            VALUES (4, 'tenant-admin@localhost', '$2y$10$9y1YVrC4vaTzUdZK9QiOXuYeMg8DlIokX.N7wTyZFKruvEkMmpsGW', 'TenantAdministrator', 'TenantAdministrator', true, 'en', 'system', 'system', '${DEFAULT_TENANT_ID}')
        `);

        const result = await queryRunner.query(`
            SELECT COUNT(*) as count FROM "jhi_user_authority"
            WHERE "user_id" = 4
        `);
        if (result[0].count != 0) {
            throw new Error('Relation in "jhi_user_authority" for "user_id" (4) already exists');
        }

        await queryRunner.query(`
            INSERT INTO "jhi_user_authority" ("user_id", "authority_name")
            VALUES (4, 'ROLE_TENANT_ADMIN')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const usersCount = await queryRunner.query(`
            SELECT COUNT(*) as count FROM "jhi_user"
            WHERE "id" = 4
        `);
        if (usersCount[0].count == 0) {
            throw new Error('User with id (4) doesn\'t exist');
        }

        const result = await queryRunner.query(`
            SELECT COUNT(*) as count FROM "jhi_user_authority"
            WHERE "user_id" = 4
        `);
        if (result[0].count == 0) {
            throw new Error('Couldn\'t find "user_id" (4) in "jhi_user_authority"');
        }

        await queryRunner.query(`
            DELETE FROM "jhi_user_authority"
            WHERE "user_id" = 4
        `);

        await queryRunner.query(`
            DELETE FROM "jhi_user"
            WHERE "id" = 4
        `);
    }
}
