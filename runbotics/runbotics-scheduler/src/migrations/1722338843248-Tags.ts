import { MigrationInterface, QueryRunner } from "typeorm";

export class Tags1722338843248 implements MigrationInterface {
    name = 'Tags1722338843248'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tag" DROP CONSTRAINT "fk_tag_tenant_id"`);
        await queryRunner.query(`ALTER TABLE "tag" DROP CONSTRAINT "tag_un"`);
        await queryRunner.query(`ALTER TABLE "tag" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "tag" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tag" ALTER COLUMN "tenant_id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "tag" ADD CONSTRAINT "FK_9b708ddb562dda650d6b679fb1e" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tag" DROP CONSTRAINT "FK_9b708ddb562dda650d6b679fb1e"`);
        await queryRunner.query(`ALTER TABLE "tag" ALTER COLUMN "tenant_id" SET DEFAULT 'b7f9092f-5973-c781-08db-4d6e48f78e98'`);
        await queryRunner.query(`ALTER TABLE "tag" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "tag" ADD "name" character varying(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tag" ADD CONSTRAINT "tag_un" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "tag" ADD CONSTRAINT "fk_tag_tenant_id" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
