import { MigrationInterface, QueryRunner } from "typeorm";

export class FeatureKeyTenantDeclineUser1738100319181 implements MigrationInterface {
    name = 'FeatureKeyTenantDeclineUser1738100319181'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO "feature_key" ("name")
            VALUES ('TENANT_DECLINE_USER')
        `);

        await queryRunner.query(`
            INSERT INTO "authority_feature_key" ("authority", "feature_key")
            VALUES ('ROLE_TENANT_ADMIN', 'TENANT_DECLINE_USER')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM "feature_key"
            WHERE "name" = 'TENANT_DECLINE_USER'
        `);
        await queryRunner.query(`
            DELETE FROM "authority_feature_key"
            WHERE "authority" = 'ROLE_TENANT_ADMIN' AND "feature_key" = 'TENANT_DECLINE_USER'
        `);
    }
}
