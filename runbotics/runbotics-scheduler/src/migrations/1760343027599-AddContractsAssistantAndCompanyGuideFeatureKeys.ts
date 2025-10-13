import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddContractsAssistantAndCompanyGuideFeatureKeys1760343027599 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO "feature_key" ("name")
            SELECT * FROM (VALUES ('AI_ASSISTANTS_CONTRACTS_ASSISTANT'), ('AI_ASSISTANTS_COMPANY_GUIDE')) AS v(name)
            WHERE NOT EXISTS (SELECT 1 FROM "feature_key" WHERE "name" = v.name)
        `);
    }
 
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM "feature_key"
            WHERE "name" IN ('AI_ASSISTANTS_CONTRACTS_ASSISTANT', 'AI_ASSISTANTS_COMPANY_GUIDE')
        `);
    }

}
