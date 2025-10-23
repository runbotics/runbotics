import { MigrationInterface, QueryRunner } from 'typeorm';

export class AssignCompanyGuideFKToRoleUser1761204736666
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO "authority_feature_key" ("authority", "feature_key")
            VALUES ('ROLE_USER', 'AI_ASSISTANT_COMPANY_GUIDE')
            ON CONFLICT DO NOTHING;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM "authority_feature_key"
            WHERE "authority" = 'ROLE_USER' AND "feature_key" = 'AI_ASSISTANT_COMPANY_GUIDE'
        `);
    }
}
