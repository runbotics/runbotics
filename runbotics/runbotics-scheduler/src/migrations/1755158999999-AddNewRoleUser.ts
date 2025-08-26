import { MigrationInterface, QueryRunner } from 'typeorm';
 
export class AddNewRoleUser1755158999999
    implements MigrationInterface
{
    name = 'AddNewRoleUser1755158999999';
 
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO "jhi_authority" ("name")
            VALUES ('ROLE_USER')
        `);
        
        await queryRunner.query(`
            INSERT INTO "authority_feature_key" ("authority", "feature_key")
            VALUES ('ROLE_USER', 'AI_ASSISTANT_ACCESS')
        `);
    }
 
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM "authority_feature_key"
            WHERE "authority" = 'ROLE_USER' AND "feature_key" = 'AI_ASSISTANT_ACCESS'
        `);
        
        await queryRunner.query(`
            DELETE FROM "jhi_authority"
            WHERE "name" = 'ROLE_USER'
        `);
    }
}