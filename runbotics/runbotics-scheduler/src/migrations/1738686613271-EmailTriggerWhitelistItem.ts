import { MigrationInterface, QueryRunner } from "typeorm";

export class EmailTriggerWhitelistItem1738686613271 implements MigrationInterface {
    name = 'EmailTriggerWhitelistItem1738686613271'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "email_trigger_whitelist_item" ("id" BIGSERIAL NOT NULL, "whitelist_item" character varying(50) NOT NULL, "tenant_id" uuid NOT NULL, CONSTRAINT "UQ_931d07b44c7b3ceb19d13d632d7" UNIQUE ("whitelist_item", "tenant_id"), CONSTRAINT "PK_d4b5e9050829771fbab0490d339" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "email_trigger_whitelist_item" ADD CONSTRAINT "FK_6045413e26d146abe6cfa2c1994" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "email_trigger_whitelist_item" DROP CONSTRAINT "FK_6045413e26d146abe6cfa2c1994"`);
        await queryRunner.query(`DROP TABLE "email_trigger_whitelist_item"`);
    }

}
