import { MigrationInterface, QueryRunner } from 'typeorm';

export class Attribute1718196741388 implements MigrationInterface {
    name = 'Attribute1718196741388';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TABLE "scheduler"."attribute" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "tenant_id" uuid NOT NULL, CONSTRAINT "PK_b13fb7c5c9e9dff62b60e0de729" PRIMARY KEY ("id"))');
        await queryRunner.query('ALTER TABLE "scheduler"."attribute" ADD CONSTRAINT "FK_53e11054a6e395e8adf1e1c97f6" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "scheduler"."attribute" DROP CONSTRAINT "FK_53e11054a6e395e8adf1e1c97f6"');
        await queryRunner.query('DROP TABLE "scheduler"."attribute"');
    }

}
