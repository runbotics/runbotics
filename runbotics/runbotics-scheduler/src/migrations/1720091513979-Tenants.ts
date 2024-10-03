import { MigrationInterface, QueryRunner } from "typeorm";

export class Tenants1720091513979 implements MigrationInterface {
    name = 'Tenants1720091513979'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tenant" DROP CONSTRAINT "fk_tenant_created_by"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_context" DROP CONSTRAINT "FK_339e67792b324b8738cffe0194b"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_context_secret" DROP CONSTRAINT "FK_2a3cc0b689ec02ad07b29ca2cc7"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."secret" DROP CONSTRAINT "FK_2d1e3217ea4e8b4121900f8bbb6"`);
        await queryRunner.query(`ALTER TABLE "tenant" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "tenant" ALTER COLUMN "created" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tenant" ALTER COLUMN "created" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "tenant" ALTER COLUMN "updated" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tenant" ALTER COLUMN "updated" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_context" ADD CONSTRAINT "FK_339e67792b324b8738cffe0194b" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_context_secret" ADD CONSTRAINT "FK_2a3cc0b689ec02ad07b29ca2cc7" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."secret" ADD CONSTRAINT "FK_2d1e3217ea4e8b4121900f8bbb6" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tenant" ADD CONSTRAINT "FK_6746de11785f498c55e7d6959f3" FOREIGN KEY ("created_by") REFERENCES "jhi_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tenant" DROP CONSTRAINT "FK_6746de11785f498c55e7d6959f3"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."secret" DROP CONSTRAINT "FK_2d1e3217ea4e8b4121900f8bbb6"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_context_secret" DROP CONSTRAINT "FK_2a3cc0b689ec02ad07b29ca2cc7"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_context" DROP CONSTRAINT "FK_339e67792b324b8738cffe0194b"`);
        await queryRunner.query(`ALTER TABLE "tenant" ALTER COLUMN "updated" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "tenant" ALTER COLUMN "updated" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tenant" ALTER COLUMN "created" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "tenant" ALTER COLUMN "created" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tenant" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "scheduler"."secret" ADD CONSTRAINT "FK_2d1e3217ea4e8b4121900f8bbb6" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_context_secret" ADD CONSTRAINT "FK_2a3cc0b689ec02ad07b29ca2cc7" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_context" ADD CONSTRAINT "FK_339e67792b324b8738cffe0194b" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tenant" ADD CONSTRAINT "fk_tenant_created_by" FOREIGN KEY ("created_by") REFERENCES "jhi_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
