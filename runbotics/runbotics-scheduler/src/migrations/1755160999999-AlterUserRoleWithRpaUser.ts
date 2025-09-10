import { MigrationInterface, QueryRunner } from 'typeorm';
 
export class AlterUserRoleWithRpaUser1755160999999
    implements MigrationInterface
{
    name = 'AlterUserRoleWithRpaUser1755160999999';
 
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            UPDATE "jhi_authority"
            SET name = 'ROLE_RPA_USER'
            WHERE name = 'ROLE_USER';
        `);
    }
 
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            UPDATE "jhi_authority"
            SET name = 'ROLE_USER'
            WHERE name = 'ROLE_RPA_USER';
        `);
    }
}