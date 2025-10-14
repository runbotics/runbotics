import { MigrationInterface, QueryRunner } from 'typeorm';

const NEW_ADMIN_PASSWORD_HASH = '$2y$10$TYtv2cTcDkXHDTVTzJ7vuertLkGB3Hw7ANFV3VcgEmCAIQOGSGTGa';
const NEW_USER_PASSWORD_HASH = '$2y$10$c4C78rvbjmm1hlxLZSncKORnur2O0AGGydKwEzybieaas3mkADCPm';
const NEW_RUNBOTICS_PASSWORD_HASH = '$2y$10$Ng1JcEWDjzaQikJR1IeghuSPE1Mq5iXPxHRKZ8JZuX/0QtCQKNDma';
const NEW_TENANT_ADMIN_PASSWORD_HASH = '$2y$10$ot8QpMagu6XXxHHUWncfUOTfCe2nb8SSpBKPlHmmbqDjPZVf6dTw2';


const OLD_ADMIN_PASSWORD_HASH = '$2a$10$8apYYeDjChxc.6eSlETR/ekQxWtVwNLDU2nL1QbpeKesvOhqyD8F.';
const OLD_USER_PASSWORD_HASH = '$2a$10$Kv6U70/7T9lvBVNShAy.hu39UxFI93MtTlVulFJXOPXU9v4Z9vcJW';
const OLD_RUNBOTICS_PASSWORD_HASH = '$2a$10$zRJCJrKA0g1LOStijfcSNOF7blj0Dbs3dO7cJqN51m2lK6V7EwWdC';
const OLD_TENANT_ADMIN_PASSWORD_HASH = '$2a$10$2CHA7semRu3ZalLjpKEImOBpFIttTDesjbxMCGCadP3rYJ6H3P5We';

export class UpdateDefaultUsersPasswordPolicy1759825538154 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
                UPDATE "jhi_user" SET password_hash = '${NEW_ADMIN_PASSWORD_HASH}' WHERE id = 1 AND email = 'admin@localhost';
                UPDATE "jhi_user" SET password_hash = '${NEW_USER_PASSWORD_HASH}' WHERE id = 2 AND email = 'rpa-user@localhost';
                UPDATE "jhi_user" SET password_hash = '${NEW_RUNBOTICS_PASSWORD_HASH}' WHERE id = 3 AND email = 'runbotics@localhost';
                UPDATE "jhi_user" SET password_hash = '${NEW_TENANT_ADMIN_PASSWORD_HASH}' WHERE id = 4 AND email = 'tenant-admin@localhost';
            `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
                UPDATE "jhi_user" SET password_hash = '${OLD_ADMIN_PASSWORD_HASH}' WHERE id = 1 AND email = 'admin@localhost';
                UPDATE "jhi_user" SET password_hash = '${OLD_USER_PASSWORD_HASH}' WHERE id = 2 AND email = 'rpa-user@localhost';
                UPDATE "jhi_user" SET password_hash = '${OLD_RUNBOTICS_PASSWORD_HASH}' WHERE id = 3 AND email = 'runbotics@localhost';
                UPDATE "jhi_user" SET password_hash = '${OLD_TENANT_ADMIN_PASSWORD_HASH}' WHERE id = 4 AND email = 'tenant-admin@localhost';
            `);
    }

}
