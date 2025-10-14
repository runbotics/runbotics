import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWebhookEntities1760443237344 implements MigrationInterface {
    name = 'AddWebhookEntities1760443237344';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "scheduler"."webhook_process_trigger"
                                 (
                                     "id"         uuid      NOT NULL DEFAULT uuid_generate_v4(),
                                     "tenant_id"  uuid      NOT NULL,
                                     "webhook_id" uuid      NOT NULL,
                                     "process_id" bigint    NOT NULL,
                                     "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                                     CONSTRAINT "PK_b1dcbad17e157350ad98aa7226b" PRIMARY KEY ("id")
                                 )`);
        await queryRunner.query(`CREATE INDEX "IDX_b0fca39af6e0c5f5c67ff94546" ON "scheduler"."webhook_process_trigger" ("tenant_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_c4709dfbd6874c2a2c25447db2" ON "scheduler"."webhook_process_trigger" ("webhook_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_80e846d6b3be1c6d910e1ca5ed" ON "scheduler"."webhook_process_trigger" ("process_id") `);
        await queryRunner.query(`CREATE TYPE "scheduler"."webhook_authorization_type_enum" AS ENUM('jwt')`);
        await queryRunner.query(`CREATE TABLE "scheduler"."webhook_authorization"
                                 (
                                     "id"   uuid                                          NOT NULL DEFAULT uuid_generate_v4(),
                                     "type" "scheduler"."webhook_authorization_type_enum" NOT NULL,
                                     "data" jsonb,
                                     CONSTRAINT "PK_f3b6e66716e7b5bb809ccf73b68" PRIMARY KEY ("id")
                                 )`);
        await queryRunner.query(`CREATE TABLE "scheduler"."client_registration_webhook"
                                 (
                                     "id"                          uuid              NOT NULL DEFAULT uuid_generate_v4(),
                                     "name"                        character varying NOT NULL,
                                     "tenant_id"                   uuid              NOT NULL,
                                     "created_at"                  TIMESTAMP         NOT NULL DEFAULT now(),
                                     "updated_at"                  TIMESTAMP         NOT NULL DEFAULT now(),
                                     "active"                      boolean           NOT NULL DEFAULT true,
                                     "application_URL"             character varying NOT NULL,
                                     "authorization_id"            uuid,
                                     "client_registration_auth_id" uuid,
                                     "payload_id"                  uuid,
                                     "registration_payload"        jsonb,
                                     "client_authorization_id"     uuid,
                                     CONSTRAINT "REL_c9872831e0f9f07840e3b6b5a4" UNIQUE ("authorization_id"),
                                     CONSTRAINT "REL_4a5df04b1f52c5cddc1e4400c4" UNIQUE ("client_authorization_id"),
                                     CONSTRAINT "REL_2ce8a8f01d8a091f0bcb6feda7" UNIQUE ("payload_id"),
                                     CONSTRAINT "PK_01a9eead72e08743691cea77c3a" PRIMARY KEY ("id")
                                 )`);
        await queryRunner.query(`CREATE INDEX "IDX_e162fe82ef970eb3b84abe3f4e" ON "scheduler"."client_registration_webhook" ("tenant_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_c9872831e0f9f07840e3b6b5a4" ON "scheduler"."client_registration_webhook" ("authorization_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_878ac3a0935f61949111cbda05" ON "scheduler"."client_registration_webhook" ("client_registration_auth_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_2ce8a8f01d8a091f0bcb6feda7" ON "scheduler"."client_registration_webhook" ("payload_id") `);
        await queryRunner.query(`CREATE TABLE "scheduler"."webhook_payload"
                                 (
                                     "id"                             uuid              NOT NULL DEFAULT uuid_generate_v4(),
                                     "webhookIdPath"                  character varying NOT NULL,
                                     "payloadDataPath"                character varying NOT NULL,
                                     "client_registration_webhook_id" uuid,
                                     CONSTRAINT "REL_a8309a649db2d54caa85ee5aca" UNIQUE ("client_registration_webhook_id"),
                                     CONSTRAINT "PK_9582203307b730a7b02e90c48f0" PRIMARY KEY ("id")
                                 )`);
        await queryRunner.query(`CREATE TABLE "scheduler"."webhook_incoming_event_log"
                                 (
                                     "id"            uuid      NOT NULL DEFAULT uuid_generate_v4(),
                                     "payload"       character varying,
                                     "authorization" character varying,
                                     "status"        character varying,
                                     "created_at"    TIMESTAMP NOT NULL DEFAULT now(),
                                     "error"         character varying,
                                     CONSTRAINT "PK_e89f6a9015a0a81e0a008d008fe" PRIMARY KEY ("id")
                                 )`);
        await queryRunner.query(`ALTER TABLE "tenant"
            ADD "service_token_exp_date" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "scheduler"."webhook_process_trigger"
            ADD CONSTRAINT "FK_b0fca39af6e0c5f5c67ff945466" FOREIGN KEY ("tenant_id") REFERENCES "tenant" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."webhook_process_trigger"
            ADD CONSTRAINT "FK_c4709dfbd6874c2a2c25447db28" FOREIGN KEY ("webhook_id") REFERENCES "scheduler"."client_registration_webhook" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."webhook_process_trigger"
            ADD CONSTRAINT "FK_80e846d6b3be1c6d910e1ca5edd" FOREIGN KEY ("process_id") REFERENCES "process" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."client_registration_webhook"
            ADD CONSTRAINT "FK_e162fe82ef970eb3b84abe3f4ed" FOREIGN KEY ("tenant_id") REFERENCES "tenant" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."client_registration_webhook"
            ADD CONSTRAINT "FK_c9872831e0f9f07840e3b6b5a4c" FOREIGN KEY ("authorization_id") REFERENCES "scheduler"."webhook_authorization" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."client_registration_webhook"
            ADD CONSTRAINT "FK_4a5df04b1f52c5cddc1e4400c45" FOREIGN KEY ("client_authorization_id") REFERENCES "scheduler"."webhook_authorization" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."client_registration_webhook"
            ADD CONSTRAINT "FK_2ce8a8f01d8a091f0bcb6feda79" FOREIGN KEY ("payload_id") REFERENCES "scheduler"."webhook_payload" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."webhook_payload"
            ADD CONSTRAINT "FK_a8309a649db2d54caa85ee5acac" FOREIGN KEY ("client_registration_webhook_id") REFERENCES "scheduler"."client_registration_webhook" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scheduler"."webhook_payload"
            DROP CONSTRAINT "FK_a8309a649db2d54caa85ee5acac"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."client_registration_webhook"
            DROP CONSTRAINT "FK_2ce8a8f01d8a091f0bcb6feda79"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."client_registration_webhook"
            DROP CONSTRAINT "FK_4a5df04b1f52c5cddc1e4400c45"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."client_registration_webhook"
            DROP CONSTRAINT "FK_c9872831e0f9f07840e3b6b5a4c"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."client_registration_webhook"
            DROP CONSTRAINT "FK_e162fe82ef970eb3b84abe3f4ed"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."webhook_process_trigger"
            DROP CONSTRAINT "FK_80e846d6b3be1c6d910e1ca5edd"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."webhook_process_trigger"
            DROP CONSTRAINT "FK_c4709dfbd6874c2a2c25447db28"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."webhook_process_trigger"
            DROP CONSTRAINT "FK_b0fca39af6e0c5f5c67ff945466"`);
        await queryRunner.query(`ALTER TABLE "tenant"
            DROP COLUMN "service_token_exp_date"`);
        await queryRunner.query(`DROP TABLE "scheduler"."webhook_incoming_event_log"`);
        await queryRunner.query(`DROP TABLE "scheduler"."webhook_payload"`);
        await queryRunner.query(`DROP INDEX "scheduler"."IDX_2ce8a8f01d8a091f0bcb6feda7"`);
        await queryRunner.query(`DROP INDEX "scheduler"."IDX_878ac3a0935f61949111cbda05"`);
        await queryRunner.query(`DROP INDEX "scheduler"."IDX_c9872831e0f9f07840e3b6b5a4"`);
        await queryRunner.query(`DROP INDEX "scheduler"."IDX_e162fe82ef970eb3b84abe3f4e"`);
        await queryRunner.query(`DROP TABLE "scheduler"."client_registration_webhook"`);
        await queryRunner.query(`DROP TABLE "scheduler"."webhook_authorization"`);
        await queryRunner.query(`DROP TYPE "scheduler"."webhook_authorization_type_enum"`);
        await queryRunner.query(`DROP INDEX "scheduler"."IDX_80e846d6b3be1c6d910e1ca5ed"`);
        await queryRunner.query(`DROP INDEX "scheduler"."IDX_c4709dfbd6874c2a2c25447db2"`);
        await queryRunner.query(`DROP INDEX "scheduler"."IDX_b0fca39af6e0c5f5c67ff94546"`);
        await queryRunner.query(`DROP TABLE "scheduler"."webhook_process_trigger"`);
    }

}
