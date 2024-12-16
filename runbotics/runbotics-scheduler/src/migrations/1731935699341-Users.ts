import { MigrationInterface, QueryRunner } from "typeorm";

export class Users1731935699341 implements MigrationInterface {
    name = 'Users1731935699341'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "jhi_user" DROP CONSTRAINT "fk_jhi_user_tenant_id"`);
        await queryRunner.query(`ALTER TABLE "jhi_user" DROP CONSTRAINT "ux_user_login"`);
        await queryRunner.query(`ALTER TABLE "jhi_user" DROP COLUMN "login"`);
        await queryRunner.query(`ALTER TABLE "jhi_user" ALTER COLUMN "email" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "jhi_user" DROP CONSTRAINT "ux_user_email"`);
        await queryRunner.query(`ALTER TABLE "jhi_user" ALTER COLUMN "lang_key" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "jhi_user" ALTER COLUMN "lang_key" SET DEFAULT 'en'`);
        await queryRunner.query(`ALTER TABLE "jhi_user" ALTER COLUMN "tenant_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "jhi_user" ALTER COLUMN "created_date" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "jhi_user" ALTER COLUMN "created_date" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "jhi_user" ALTER COLUMN "last_modified_date" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "jhi_user" ALTER COLUMN "last_modified_date" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "jhi_user" ALTER COLUMN "last_modified_by" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "jhi_user" ADD CONSTRAINT "FK_6fce8873a4aeb28bfe7764e723c" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "jhi_user" DROP CONSTRAINT "FK_6fce8873a4aeb28bfe7764e723c"`);
        await queryRunner.query(`ALTER TABLE "jhi_user" ALTER COLUMN "last_modified_by" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "jhi_user" ALTER COLUMN "last_modified_date" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "jhi_user" ALTER COLUMN "last_modified_date" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "jhi_user" ALTER COLUMN "created_date" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "jhi_user" ALTER COLUMN "created_date" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "jhi_user" ALTER COLUMN "tenant_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "jhi_user" ALTER COLUMN "lang_key" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "jhi_user" ALTER COLUMN "lang_key" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "jhi_user" ADD CONSTRAINT "ux_user_email" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "jhi_user" ALTER COLUMN "email" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "jhi_user" ADD "login" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "jhi_user" ADD CONSTRAINT "ux_user_login" UNIQUE ("login")`);
        await queryRunner.query(`ALTER TABLE "jhi_user" ADD CONSTRAINT "fk_jhi_user_tenant_id" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
