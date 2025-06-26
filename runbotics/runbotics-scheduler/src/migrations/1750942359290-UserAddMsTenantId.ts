import { MigrationInterface, QueryRunner } from "typeorm";

export class UserAddMsTenantId1750942359290 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "jhi_user"
            ADD COLUMN "microsoft_tenant_id" varchar(256) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "jhi_user"
            DROP COLUMN "microsoft_tenant_id"
        `);
    }

}
