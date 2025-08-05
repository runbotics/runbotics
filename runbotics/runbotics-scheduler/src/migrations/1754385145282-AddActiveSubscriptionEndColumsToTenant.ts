import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddActiveSubscriptionEndColumsToTenant1754385145282 implements MigrationInterface {
    name = 'AddActiveSubscriptionEndColumsToTenant1754385145282';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tenant"
            ADD "active" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "tenant"
            ADD "subscriptionEnd" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tenant"
            DROP COLUMN "subscriptionEnd"`);
        await queryRunner.query(`ALTER TABLE "tenant"
            DROP COLUMN "active"`);
    }

}
