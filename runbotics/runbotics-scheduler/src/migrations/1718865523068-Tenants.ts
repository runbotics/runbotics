import { MigrationInterface, QueryRunner } from "typeorm";

export class Tenants1718865523068 implements MigrationInterface {
    name = 'Tenants1718865523068'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "scheduler"."tenant" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_by" bigint NOT NULL, "created" TIMESTAMP WITH TIME ZONE NOT NULL, "updated" TIMESTAMP WITH TIME ZONE NOT NULL, "last_modified_by" character varying(50) NOT NULL, CONSTRAINT "UQ_56211336b5ff35fd944f2259173" UNIQUE ("name"), CONSTRAINT "PK_da8c6efd67bb301e810e56ac139" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "scheduler"."tenant"`);
    }

}
