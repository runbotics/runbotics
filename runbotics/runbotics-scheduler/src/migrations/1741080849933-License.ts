import { MigrationInterface, QueryRunner } from "typeorm";

export class License1741080849933 implements MigrationInterface {
    name = 'License1741080849933'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "scheduler"."license" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "plugin_name" character varying(100) NOT NULL, "tenant_id" uuid NOT NULL, "license_key" character varying(255) NOT NULL, "license" character varying(255) NOT NULL, "exp_date" date NOT NULL, CONSTRAINT "UQ_b78d9b40ae0cc0951138fc8090a" UNIQUE ("license_key", "license", "tenant_id"), CONSTRAINT "PK_f168ac1ca5ba87286d03b2ef905" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "scheduler"."license" ADD CONSTRAINT "FK_76e556afe6925cabc4c8f73b61e" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scheduler"."license" DROP CONSTRAINT "FK_76e556afe6925cabc4c8f73b61e"`);
        await queryRunner.query(`DROP TABLE "scheduler"."license"`);
    }

}
