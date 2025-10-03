import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeUserAccountRoleToRoleUser1759497597916
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            UPDATE "jhi_user_authority"
            SET authority_name = 'ROLE_USER'
            WHERE user_id = 2;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            UPDATE "jhi_user_authority"
            SET authority_name = 'ROLE_RPA_USER'
            WHERE user_id = 2;
        `);
    }
}
