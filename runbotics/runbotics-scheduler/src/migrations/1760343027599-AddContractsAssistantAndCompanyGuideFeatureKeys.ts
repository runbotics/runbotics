import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddContractsAssistantAndCompanyGuideFeatureKeys1760343027599 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO "feature_key" ("name")
            SELECT * FROM (VALUES ('AI_ASSISTANT_CONTRACTS_ASSISTANT'), ('AI_ASSISTANT_COMPANY_GUIDE')) AS v(name)
            WHERE NOT EXISTS (SELECT 1 FROM "feature_key" WHERE "name" = v.name)
        `);

        await queryRunner.query(`
            UPDATE "feature_key" 
            SET "name" = 'AI_ASSISTANTS_ACCESS' 
            WHERE "name" = 'AI_ASSISTANT_ACCESS'
        `);
    }
 
    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
            UPDATE "feature_key" 
            SET "name" = 'AI_ASSISTANT_ACCESS' 
            WHERE "name" = 'AI_ASSISTANTS_ACCESS'
        `);

        await queryRunner.query(`
            DELETE FROM "feature_key"
            WHERE "name" IN ('AI_ASSISTANT_CONTRACTS_ASSISTANT', 'AI_ASSISTANT_COMPANY_GUIDE')
        `);
    }

}
