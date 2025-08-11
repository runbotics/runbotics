import { MigrationInterface, QueryRunner } from 'typeorm';

export class AdminBotFeatureKeyChange1747731999999 implements MigrationInterface {
    name = 'AdminBotFeatureKeyChange1747731999999';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM "authority_feature_key"
            WHERE "authority" = 'ROLE_ADMIN' AND "feature_key" IN (
                'BOT_COLLECTION_ALL_ACCESS',
                'BOT_COLLECTION_ADD',
                'BOT_COLLECTION_DELETE',
                'BOT_COLLECTION_EDIT',
                'BOT_COLLECTION_READ',
                'BOT_DELETE',
                'BOT_HISTORY_READ',
                'BOT_LOG_READ',
                'BOT_READ'
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO "authority_feature_key" ("authority", "feature_key")
            VALUES
                ('ROLE_ADMIN', 'BOT_COLLECTION_ALL_ACCESS'),
                ('ROLE_ADMIN', 'BOT_COLLECTION_ADD'),
                ('ROLE_ADMIN', 'BOT_COLLECTION_DELETE'),
                ('ROLE_ADMIN', 'BOT_COLLECTION_EDIT'),
                ('ROLE_ADMIN', 'BOT_COLLECTION_READ'),
                ('ROLE_ADMIN', 'BOT_DELETE'),
                ('ROLE_ADMIN', 'BOT_HISTORY_READ'),
                ('ROLE_ADMIN', 'BOT_LOG_READ'),
                ('ROLE_ADMIN', 'BOT_READ')
        `);
    }

}
