import { User } from '#/scheduler-database/user/user.entity';
import { DEFAULT_TENANT_ID } from '#/utils/tenant.utils';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class UsersTenantAdmin1733325722538 implements MigrationInterface {
    name = 'UsersTenantAdmin1733325722538';

    public async up(queryRunner: QueryRunner): Promise<void> {
        const userRepository = queryRunner.manager.getRepository(User);
        const tenantAdmin = await userRepository.findOne({ where: { id: 4 } });
        if (tenantAdmin) {
            throw new Error('User with id (4) already exists');
        }

        const user = new User();
        user.id = 4;
        user.email = 'tenant-admin@localhost';
        user.passwordHash = '$2a$10$HFfD1e.PVrgnqoK7StH25On4w8e49dMLlT5FZ0zTHxGxbMZU6Q/5O';
        user.firstName = 'TenantAdministrator';
        user.lastName = 'TenantAdministrator';
        user.activated = true;
        user.langKey = 'en';
        user.createdBy = 'system';
        user.lastModifiedBy = 'system';
        user.tenantId = DEFAULT_TENANT_ID;

        await userRepository.insert(user);

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
        const userRepository = queryRunner.manager.getRepository(User);
        const tenantAdmin = await userRepository.findOne({ where: { id: 4 } });
        if (!tenantAdmin) {
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

        await userRepository.delete({ id: 4 });
    }
}
