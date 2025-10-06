import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDefaultAccountWthRoleUser1759497597916
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
                INSERT INTO "jhi_user" (
                    id,
                    email,
                    password_hash,
                    first_name,
                    last_name,
                    activated,
                    lang_key,
                    tenant_id,
                    created_by,
                    created_date,
                    last_modified_by,
                    last_modified_date
                ) VALUES (
                    5,
                    'user@localhost',
                    '$2a$10$0vnKkp5IFbeEG3s.8GEzv.jZwq7hzHbfj3cFFNmHbdqwIc/ai2tn6',
                    'User',
                    'User',
                    true,
                    'en',
                    'b7f9092f-5973-c781-08db-4d6e48f78e98',
                    'system',
                    NOW(),
                    'system',
                    NOW()
                )
            `);
        await queryRunner.query(`
                INSERT INTO "jhi_user_authority" (user_id, authority_name) VALUES (5, 'ROLE_USER')
            `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
                DELETE FROM "jhi_user_authority" WHERE user_id = 5`);
        await queryRunner.query('DELETE FROM "jhi_user" WHERE id = 5');
    }
}
