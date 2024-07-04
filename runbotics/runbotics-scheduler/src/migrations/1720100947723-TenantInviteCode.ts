import { MigrationInterface, QueryRunner } from "typeorm";

export class TenantInviteCode1720100947723 implements MigrationInterface {
    name = 'TenantInviteCode1720100947723'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tenant_invite_code" DROP CONSTRAINT "fk_tenant_id"`);
        await queryRunner.query(`ALTER TABLE "tenant_invite_code" ALTER COLUMN "invite_id" SET DEFAULT uuid_generate_v4()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tenant_invite_code" ALTER COLUMN "invite_id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "tenant_invite_code" ADD CONSTRAINT "fk_tenant_id" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
