import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeUserDefaultAccountNameToRpaUser1759491544949
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            UPDATE "jhi_user"
            SET 
                email = 'rpa-user@localhost',
                first_name = 'RpaUser',
                last_name = 'RpaUser',
                last_modified_date = NOW()
            WHERE id = 2;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            UPDATE "jhi_user"
            SET 
                email = 'user@localhost',
                first_name = 'User',
                last_name = 'User',
                last_modified_date = NOW()
            WHERE id = 2;`);
    }
}
