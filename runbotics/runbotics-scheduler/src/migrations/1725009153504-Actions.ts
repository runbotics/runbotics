import { MigrationInterface, QueryRunner } from "typeorm";

export class Actions1725009153504 implements MigrationInterface {
    name = 'Actions1725009153504'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "action" ADD "tenant_id" uuid NOT NULL DEFAULT 'b7f9092f-5973-c781-08db-4d6e48f78e98'`);
        await queryRunner.query(`ALTER TABLE "action" ALTER COLUMN "label" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "action" ALTER COLUMN "form" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "action" ALTER COLUMN "script" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "action" ADD CONSTRAINT "UQ_ef450ee548dec2dd808b1e5e9d3" UNIQUE ("tenant_id", "id")`);
        await queryRunner.query(`ALTER TABLE "action" ADD CONSTRAINT "FK_a49fc6025ef52a40ad606029f9c" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "action" DROP CONSTRAINT "FK_a49fc6025ef52a40ad606029f9c"`);
        await queryRunner.query(`ALTER TABLE "action" DROP CONSTRAINT "UQ_ef450ee548dec2dd808b1e5e9d3"`);
        await queryRunner.query(`ALTER TABLE "action" ALTER COLUMN "script" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "action" ALTER COLUMN "form" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "action" ALTER COLUMN "label" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "action" DROP COLUMN "tenant_id"`);
    }

}
