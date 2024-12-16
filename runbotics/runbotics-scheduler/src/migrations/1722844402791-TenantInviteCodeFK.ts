import { MigrationInterface, QueryRunner } from "typeorm";

export class TenantInviteCodeFK1722844402791 implements MigrationInterface {
    name = 'TenantInviteCodeFK1722844402791'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tenant_invite_code" ADD CONSTRAINT "FK_c1f9c92f57be3635e522a5e2259" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tenant_invite_code" DROP CONSTRAINT "FK_c1f9c92f57be3635e522a5e2259"`);
    }

}
