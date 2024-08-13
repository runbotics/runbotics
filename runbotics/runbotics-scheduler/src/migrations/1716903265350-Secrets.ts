import { MigrationInterface, QueryRunner } from "typeorm";

export class Secrets1716903265350 implements MigrationInterface {
    name = 'Secrets1716903265350'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // typeorm renames constraints that do not match its convention
        await queryRunner.query(`ALTER TABLE "authority_feature_key" DROP CONSTRAINT "fk_authority_feature_key_authority"`);
        await queryRunner.query(`ALTER TABLE "authority_feature_key" DROP CONSTRAINT "fk_authority_feature_key_feature_key"`);
        await queryRunner.query(`ALTER TABLE "bot_collection_user" DROP CONSTRAINT "fk_bot_collection_user_user_id"`);
        await queryRunner.query(`ALTER TABLE "bot_collection_user" DROP CONSTRAINT "fk_bot_collection_user_bot_collection_id"`);
        await queryRunner.query(`ALTER TABLE "notification_process" DROP CONSTRAINT "fk_type_notification_process"`);
        await queryRunner.query(`ALTER TABLE "notification_process" DROP CONSTRAINT "fk_user_id_notification_process"`);
        await queryRunner.query(`ALTER TABLE "notification_process" DROP CONSTRAINT "fk_process_id_notification_process"`);
        await queryRunner.query(`ALTER TABLE "jhi_user_authority" DROP CONSTRAINT "fk_user_authority_user_id"`);
        await queryRunner.query(`ALTER TABLE "jhi_user_authority" DROP CONSTRAINT "fk_authority_name"`);
        await queryRunner.query(`ALTER TABLE "notification_bot" DROP CONSTRAINT "fk_type_notification_bot"`);
        await queryRunner.query(`ALTER TABLE "notification_bot" DROP CONSTRAINT "fk_user_id_notification_bot"`);
        await queryRunner.query(`ALTER TABLE "notification_bot" DROP CONSTRAINT "fk_bot_id_notification_bot"`);
        await queryRunner.query(`CREATE TABLE "scheduler"."process_context" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenant_id" uuid NOT NULL, "process_id" bigint NOT NULL, CONSTRAINT "REL_2436e0d0185232f33d7de31be3" UNIQUE ("process_id"), CONSTRAINT "PK_e7389e8eda74da686d637d7dbe4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "scheduler"."process_context_secret" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "tenant_id" uuid NOT NULL, "process_context_id" uuid NOT NULL, "secret_id" uuid NOT NULL, "order" integer NOT NULL, CONSTRAINT "REL_73e3b1df07fd1015969f9b9b51" UNIQUE ("secret_id"), CONSTRAINT "PK_2dc32cd0f720effcfd02bbaa14c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "scheduler"."secret" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenant_id" uuid NOT NULL, "data" text NOT NULL, "iv" text NOT NULL, CONSTRAINT "PK_6afa4961954e17ec2d6401afc3d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "notification_process" DROP CONSTRAINT "notification_process_pkey"`);
        await queryRunner.query(`ALTER TABLE "notification_process" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "notification_process" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "notification_process" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "notification_bot" DROP CONSTRAINT "notification_bot_pkey"`);
        await queryRunner.query(`ALTER TABLE "notification_bot" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "notification_bot" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "notification_bot" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "notification_process" ADD CONSTRAINT "PK_3c678904d9bfedf7069902ed199" PRIMARY KEY ("process_id", "user_id")`);
        await queryRunner.query(`ALTER TABLE "notification_bot" ADD CONSTRAINT "PK_758fa16a3a1cd435f4e95dee020" PRIMARY KEY ("bot_id", "user_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_ee32be0d48bb43e55e430862ca" ON "authority_feature_key" ("authority") `);
        await queryRunner.query(`CREATE INDEX "IDX_d16bcd920bc96d726d179b6cce" ON "authority_feature_key" ("feature_key") `);
        await queryRunner.query(`CREATE INDEX "IDX_84c327d024fd89e6d221a067ea" ON "bot_collection_user" ("bot_collection_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_e88c501605e0063783ee80b7b0" ON "bot_collection_user" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_7b592798f4addb0d321581b70b" ON "notification_process" ("process_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_e1a2280a824e267cdb588c74bd" ON "notification_process" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_f110dd27f6b2da20b3f90cff63" ON "jhi_user_authority" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_e230cfc3537bf2ea327f2c97c8" ON "jhi_user_authority" ("authority_name") `);
        await queryRunner.query(`CREATE INDEX "IDX_7b63cf21b9a8d158b61d4358ab" ON "notification_bot" ("bot_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_63e8bb25d071a7bbd6b80b2503" ON "notification_bot" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_context" ADD CONSTRAINT "FK_339e67792b324b8738cffe0194b" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_context" ADD CONSTRAINT "FK_2436e0d0185232f33d7de31be33" FOREIGN KEY ("process_id") REFERENCES "process"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_context_secret" ADD CONSTRAINT "FK_2a3cc0b689ec02ad07b29ca2cc7" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_context_secret" ADD CONSTRAINT "FK_4c84d7884afcc4821043408b2ea" FOREIGN KEY ("process_context_id") REFERENCES "scheduler"."process_context"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_context_secret" ADD CONSTRAINT "FK_73e3b1df07fd1015969f9b9b513" FOREIGN KEY ("secret_id") REFERENCES "scheduler"."secret"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."secret" ADD CONSTRAINT "FK_2d1e3217ea4e8b4121900f8bbb6" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "authority_feature_key" ADD CONSTRAINT "FK_ee32be0d48bb43e55e430862cad" FOREIGN KEY ("authority") REFERENCES "jhi_authority"("name") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "authority_feature_key" ADD CONSTRAINT "FK_d16bcd920bc96d726d179b6cceb" FOREIGN KEY ("feature_key") REFERENCES "feature_key"("name") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "bot_collection_user" ADD CONSTRAINT "FK_84c327d024fd89e6d221a067ea6" FOREIGN KEY ("bot_collection_id") REFERENCES "bot_collection"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "bot_collection_user" ADD CONSTRAINT "FK_e88c501605e0063783ee80b7b0e" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "notification_process" ADD CONSTRAINT "FK_7b592798f4addb0d321581b70ba" FOREIGN KEY ("process_id") REFERENCES "process"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "notification_process" ADD CONSTRAINT "FK_e1a2280a824e267cdb588c74bd9" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "jhi_user_authority" ADD CONSTRAINT "FK_f110dd27f6b2da20b3f90cff632" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "jhi_user_authority" ADD CONSTRAINT "FK_e230cfc3537bf2ea327f2c97c84" FOREIGN KEY ("authority_name") REFERENCES "jhi_authority"("name") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "notification_bot" ADD CONSTRAINT "FK_7b63cf21b9a8d158b61d4358abe" FOREIGN KEY ("bot_id") REFERENCES "bot"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "notification_bot" ADD CONSTRAINT "FK_63e8bb25d071a7bbd6b80b2503a" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification_bot" DROP CONSTRAINT "FK_63e8bb25d071a7bbd6b80b2503a"`);
        await queryRunner.query(`ALTER TABLE "notification_bot" DROP CONSTRAINT "FK_7b63cf21b9a8d158b61d4358abe"`);
        await queryRunner.query(`ALTER TABLE "jhi_user_authority" DROP CONSTRAINT "FK_e230cfc3537bf2ea327f2c97c84"`);
        await queryRunner.query(`ALTER TABLE "jhi_user_authority" DROP CONSTRAINT "FK_f110dd27f6b2da20b3f90cff632"`);
        await queryRunner.query(`ALTER TABLE "notification_process" DROP CONSTRAINT "FK_e1a2280a824e267cdb588c74bd9"`);
        await queryRunner.query(`ALTER TABLE "notification_process" DROP CONSTRAINT "FK_7b592798f4addb0d321581b70ba"`);
        await queryRunner.query(`ALTER TABLE "bot_collection_user" DROP CONSTRAINT "FK_e88c501605e0063783ee80b7b0e"`);
        await queryRunner.query(`ALTER TABLE "bot_collection_user" DROP CONSTRAINT "FK_84c327d024fd89e6d221a067ea6"`);
        await queryRunner.query(`ALTER TABLE "authority_feature_key" DROP CONSTRAINT "FK_d16bcd920bc96d726d179b6cceb"`);
        await queryRunner.query(`ALTER TABLE "authority_feature_key" DROP CONSTRAINT "FK_ee32be0d48bb43e55e430862cad"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."secret" DROP CONSTRAINT "FK_2d1e3217ea4e8b4121900f8bbb6"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_context_secret" DROP CONSTRAINT "FK_73e3b1df07fd1015969f9b9b513"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_context_secret" DROP CONSTRAINT "FK_4c84d7884afcc4821043408b2ea"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_context_secret" DROP CONSTRAINT "FK_2a3cc0b689ec02ad07b29ca2cc7"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_context" DROP CONSTRAINT "FK_2436e0d0185232f33d7de31be33"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_context" DROP CONSTRAINT "FK_339e67792b324b8738cffe0194b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_63e8bb25d071a7bbd6b80b2503"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7b63cf21b9a8d158b61d4358ab"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e230cfc3537bf2ea327f2c97c8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f110dd27f6b2da20b3f90cff63"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e1a2280a824e267cdb588c74bd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7b592798f4addb0d321581b70b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e88c501605e0063783ee80b7b0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_84c327d024fd89e6d221a067ea"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d16bcd920bc96d726d179b6cce"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ee32be0d48bb43e55e430862ca"`);
        await queryRunner.query(`ALTER TABLE "notification_bot" DROP CONSTRAINT "PK_758fa16a3a1cd435f4e95dee020"`);
        await queryRunner.query(`ALTER TABLE "notification_process" DROP CONSTRAINT "PK_3c678904d9bfedf7069902ed199"`);
        await queryRunner.query(`ALTER TABLE "notification_bot" ADD "created_at" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notification_bot" ADD "type" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notification_bot" ADD "id" bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notification_bot" ADD CONSTRAINT "notification_bot_pkey" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "notification_process" ADD "created_at" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notification_process" ADD "type" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notification_process" ADD "id" bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notification_process" ADD CONSTRAINT "notification_process_pkey" PRIMARY KEY ("id")`);
        await queryRunner.query(`DROP TABLE "scheduler"."secret"`);
        await queryRunner.query(`DROP TABLE "scheduler"."process_context_secret"`);
        await queryRunner.query(`DROP TABLE "scheduler"."process_context"`);
        await queryRunner.query(`ALTER TABLE "notification_bot" ADD CONSTRAINT "fk_bot_id_notification_bot" FOREIGN KEY ("bot_id") REFERENCES "bot"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification_bot" ADD CONSTRAINT "fk_user_id_notification_bot" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification_bot" ADD CONSTRAINT "fk_type_notification_bot" FOREIGN KEY ("type") REFERENCES "notification_type"("type") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "jhi_user_authority" ADD CONSTRAINT "fk_authority_name" FOREIGN KEY ("authority_name") REFERENCES "jhi_authority"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "jhi_user_authority" ADD CONSTRAINT "fk_user_authority_user_id" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification_process" ADD CONSTRAINT "fk_process_id_notification_process" FOREIGN KEY ("process_id") REFERENCES "process"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification_process" ADD CONSTRAINT "fk_user_id_notification_process" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification_process" ADD CONSTRAINT "fk_type_notification_process" FOREIGN KEY ("type") REFERENCES "notification_type"("type") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bot_collection_user" ADD CONSTRAINT "fk_bot_collection_user_bot_collection_id" FOREIGN KEY ("bot_collection_id") REFERENCES "bot_collection"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bot_collection_user" ADD CONSTRAINT "fk_bot_collection_user_user_id" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "authority_feature_key" ADD CONSTRAINT "fk_authority_feature_key_feature_key" FOREIGN KEY ("feature_key") REFERENCES "feature_key"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "authority_feature_key" ADD CONSTRAINT "fk_authority_feature_key_authority" FOREIGN KEY ("authority") REFERENCES "jhi_authority"("name") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
