import { MigrationInterface, QueryRunner } from 'typeorm';

export class FeatureKeyAIAssistantAccess1754385199999
    implements MigrationInterface
{
    name = 'FeatureKeyAIAssistantAccess1754385199999';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO "feature_key" ("name")
            VALUES ('AI_ASSISTANT_ACCESS')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM "feature_key"
            WHERE "name" = 'AI_ASSISTANT_ACCESS'
        `);
    }
}
