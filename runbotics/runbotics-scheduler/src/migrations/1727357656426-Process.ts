import { MigrationInterface, QueryRunner } from "typeorm";

export class Process1727357656426 implements MigrationInterface {
    name = 'Process1727357656426'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "process_collection" DROP CONSTRAINT "fk_process_collection_tenant_id"`);
        await queryRunner.query(`ALTER TABLE "process_collection" DROP CONSTRAINT "fk_process_collection_parent_id"`);
        await queryRunner.query(`ALTER TABLE "process_collection" DROP CONSTRAINT "fk_process_collection_created_by"`);
        await queryRunner.query(`ALTER TABLE "process" DROP CONSTRAINT "fk_process_output_type"`);
        await queryRunner.query(`ALTER TABLE "process" DROP CONSTRAINT "fk_process_tenant_id"`);
        await queryRunner.query(`ALTER TABLE "process" DROP CONSTRAINT "fk_process_collection_id"`);
        await queryRunner.query(`ALTER TABLE "process" DROP CONSTRAINT "fk_process_created_by_id"`);
        await queryRunner.query(`ALTER TABLE "process" DROP CONSTRAINT "fk_editor_id"`);
        await queryRunner.query(`ALTER TABLE "process" DROP CONSTRAINT "fk_bot_system"`);
        await queryRunner.query(`ALTER TABLE "process" DROP CONSTRAINT "fk_bot_collection_id"`);
        await queryRunner.query(`ALTER TABLE "process_collection_user" DROP CONSTRAINT "fk_process_collection_users"`);
        await queryRunner.query(`ALTER TABLE "process_collection_user" DROP CONSTRAINT "fk_user_id"`);
        await queryRunner.query(`ALTER TABLE "tag_process" DROP CONSTRAINT "fk_process_id"`);
        await queryRunner.query(`ALTER TABLE "tag_process" DROP CONSTRAINT "fk_tag_id"`);
        await queryRunner.query(`DROP INDEX "public"."process_collection_parent_id_idx"`);
        await queryRunner.query(`ALTER TABLE "tag_process" ADD CONSTRAINT "PK_5293fbda027857873ad592cf4a6" PRIMARY KEY ("process_id", "tag_id")`);
        await queryRunner.query(`ALTER TABLE "process_collection" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "process_collection" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "process_collection" ALTER COLUMN "description" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_collection" ALTER COLUMN "created" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_collection" ALTER COLUMN "created" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "process_collection" ALTER COLUMN "updated" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_collection" ALTER COLUMN "updated" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "process_global_variable" DROP CONSTRAINT "FK_a5c44b5b12113dbd973043fb6ba"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_context" DROP CONSTRAINT "FK_2436e0d0185232f33d7de31be33"`);
        await queryRunner.query(`ALTER TABLE "notification_process" DROP CONSTRAINT "FK_7b592798f4addb0d321581b70ba"`);
        await queryRunner.query(`ALTER TABLE "schedule_process" DROP CONSTRAINT "FK_a67a1ef8e8144f2d0551cdf469c"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_credential" DROP CONSTRAINT "FK_ad32ad8114ed1f6603ff6fb7c9d"`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "process_id_seq" OWNED BY "process"."id"`);
        await queryRunner.query(`ALTER TABLE "process" ALTER COLUMN "id" SET DEFAULT nextval('"process_id_seq"')`);
        await queryRunner.query(`ALTER TABLE "process" ALTER COLUMN "description" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process" ALTER COLUMN "definition" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process" ALTER COLUMN "created" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process" ALTER COLUMN "created" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "process" ALTER COLUMN "updated" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process" ALTER COLUMN "updated" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "process" ALTER COLUMN "is_public" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process" ALTER COLUMN "is_attended" SET DEFAULT false`);
        await queryRunner.query(`CREATE INDEX "IDX_23942d268cd3110024c40a71c9" ON "process_collection_user" ("collection_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_edfe5e14db9cbad42ceaa46fe2" ON "process_collection_user" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_a0791d31eb1ea33b64f2498081" ON "tag_process" ("process_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_672ac265ecfeaa72a2b7fda918" ON "tag_process" ("tag_id") `);
        await queryRunner.query(`ALTER TABLE "schedule_process" ADD CONSTRAINT "FK_a67a1ef8e8144f2d0551cdf469c" FOREIGN KEY ("process_id") REFERENCES "process"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification_process" ADD CONSTRAINT "FK_7b592798f4addb0d321581b70ba" FOREIGN KEY ("process_id") REFERENCES "process"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_credential" ADD CONSTRAINT "FK_ad32ad8114ed1f6603ff6fb7c9d" FOREIGN KEY ("process_id") REFERENCES "process"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process_collection" ADD CONSTRAINT "FK_3c30da520c249192c358cf4beb3" FOREIGN KEY ("parent_id") REFERENCES "process_collection"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process_collection" ADD CONSTRAINT "FK_8e9bec83e0f75715c43950ce006" FOREIGN KEY ("created_by") REFERENCES "jhi_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process" ADD CONSTRAINT "FK_dcbb6d9efab53e5cd77d114ff92" FOREIGN KEY ("output_type") REFERENCES "process_output"("type") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process" ADD CONSTRAINT "FK_5bfe818fdb876e108244990655e" FOREIGN KEY ("system") REFERENCES "bot_system"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process" ADD CONSTRAINT "FK_bb8605d261de168c062c6228902" FOREIGN KEY ("created_by_id") REFERENCES "jhi_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process" ADD CONSTRAINT "FK_ab868b32a58c6512b68b9960bb8" FOREIGN KEY ("bot_collection") REFERENCES "bot_collection"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process" ADD CONSTRAINT "FK_142e8f5a02f9a4789c1fb5fe1e0" FOREIGN KEY ("process_collection") REFERENCES "process_collection"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process" ADD CONSTRAINT "FK_eae582bd6ce360a062844685c03" FOREIGN KEY ("editor_id") REFERENCES "jhi_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_context" ADD CONSTRAINT "FK_2436e0d0185232f33d7de31be33" FOREIGN KEY ("process_id") REFERENCES "process"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process_collection_user" ADD CONSTRAINT "FK_23942d268cd3110024c40a71c98" FOREIGN KEY ("collection_id") REFERENCES "process_collection"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "process_collection_user" ADD CONSTRAINT "FK_edfe5e14db9cbad42ceaa46fe2e" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "process_global_variable" ADD CONSTRAINT "FK_a5c44b5b12113dbd973043fb6ba" FOREIGN KEY ("process_id") REFERENCES "process"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "tag_process" ADD CONSTRAINT "FK_a0791d31eb1ea33b64f24980811" FOREIGN KEY ("process_id") REFERENCES "process"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "tag_process" ADD CONSTRAINT "FK_672ac265ecfeaa72a2b7fda918b" FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tag_process" DROP CONSTRAINT "FK_672ac265ecfeaa72a2b7fda918b"`);
        await queryRunner.query(`ALTER TABLE "tag_process" DROP CONSTRAINT "FK_a0791d31eb1ea33b64f24980811"`);
        await queryRunner.query(`ALTER TABLE "process_global_variable" DROP CONSTRAINT "FK_a5c44b5b12113dbd973043fb6ba"`);
        await queryRunner.query(`ALTER TABLE "process_collection_user" DROP CONSTRAINT "FK_edfe5e14db9cbad42ceaa46fe2e"`);
        await queryRunner.query(`ALTER TABLE "process_collection_user" DROP CONSTRAINT "FK_23942d268cd3110024c40a71c98"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_context" DROP CONSTRAINT "FK_2436e0d0185232f33d7de31be33"`);
        await queryRunner.query(`ALTER TABLE "process" DROP CONSTRAINT "FK_eae582bd6ce360a062844685c03"`);
        await queryRunner.query(`ALTER TABLE "process" DROP CONSTRAINT "FK_142e8f5a02f9a4789c1fb5fe1e0"`);
        await queryRunner.query(`ALTER TABLE "process" DROP CONSTRAINT "FK_ab868b32a58c6512b68b9960bb8"`);
        await queryRunner.query(`ALTER TABLE "process" DROP CONSTRAINT "FK_bb8605d261de168c062c6228902"`);
        await queryRunner.query(`ALTER TABLE "process" DROP CONSTRAINT "FK_5bfe818fdb876e108244990655e"`);
        await queryRunner.query(`ALTER TABLE "process" DROP CONSTRAINT "FK_dcbb6d9efab53e5cd77d114ff92"`);
        await queryRunner.query(`ALTER TABLE "process_collection" DROP CONSTRAINT "FK_8e9bec83e0f75715c43950ce006"`);
        await queryRunner.query(`ALTER TABLE "process_collection" DROP CONSTRAINT "FK_3c30da520c249192c358cf4beb3"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_credential" DROP CONSTRAINT "FK_ad32ad8114ed1f6603ff6fb7c9d"`);
        await queryRunner.query(`ALTER TABLE "notification_process" DROP CONSTRAINT "FK_7b592798f4addb0d321581b70ba"`);
        await queryRunner.query(`ALTER TABLE "schedule_process" DROP CONSTRAINT "FK_a67a1ef8e8144f2d0551cdf469c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_672ac265ecfeaa72a2b7fda918"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a0791d31eb1ea33b64f2498081"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_edfe5e14db9cbad42ceaa46fe2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_23942d268cd3110024c40a71c9"`);
        await queryRunner.query(`ALTER TABLE "process" ALTER COLUMN "is_attended" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "process" ALTER COLUMN "is_public" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process" ALTER COLUMN "updated" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "process" ALTER COLUMN "updated" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process" ALTER COLUMN "created" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "process" ALTER COLUMN "created" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process" ALTER COLUMN "definition" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "process_id_seq"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_credential" ADD CONSTRAINT "FK_ad32ad8114ed1f6603ff6fb7c9d" FOREIGN KEY ("process_id") REFERENCES "process"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "schedule_process" ADD CONSTRAINT "FK_a67a1ef8e8144f2d0551cdf469c" FOREIGN KEY ("process_id") REFERENCES "process"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification_process" ADD CONSTRAINT "FK_7b592798f4addb0d321581b70ba" FOREIGN KEY ("process_id") REFERENCES "process"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_context" ADD CONSTRAINT "FK_2436e0d0185232f33d7de31be33" FOREIGN KEY ("process_id") REFERENCES "process"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process_global_variable" ADD CONSTRAINT "FK_a5c44b5b12113dbd973043fb6ba" FOREIGN KEY ("process_id") REFERENCES "process"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "process_collection" ALTER COLUMN "updated" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "process_collection" ALTER COLUMN "updated" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_collection" ALTER COLUMN "created" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "process_collection" ALTER COLUMN "created" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_collection" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_collection" ALTER COLUMN "id" SET DEFAULT uuid_in((md5(((random())|| (clock_timestamp())))))`);
        await queryRunner.query(`ALTER TABLE "process_collection" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "tag_process" DROP CONSTRAINT "PK_5293fbda027857873ad592cf4a6"`);
        await queryRunner.query(`CREATE INDEX "process_collection_parent_id_idx" ON "process_collection" ("parent_id") `);
        await queryRunner.query(`ALTER TABLE "tag_process" ADD CONSTRAINT "fk_tag_id" FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tag_process" ADD CONSTRAINT "fk_process_id" FOREIGN KEY ("process_id") REFERENCES "process"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process_collection_user" ADD CONSTRAINT "fk_user_id" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process_collection_user" ADD CONSTRAINT "fk_process_collection_users" FOREIGN KEY ("collection_id") REFERENCES "process_collection"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process" ADD CONSTRAINT "fk_bot_collection_id" FOREIGN KEY ("bot_collection") REFERENCES "bot_collection"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process" ADD CONSTRAINT "fk_bot_system" FOREIGN KEY ("system") REFERENCES "bot_system"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process" ADD CONSTRAINT "fk_editor_id" FOREIGN KEY ("editor_id") REFERENCES "jhi_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process" ADD CONSTRAINT "fk_process_created_by_id" FOREIGN KEY ("created_by_id") REFERENCES "jhi_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process" ADD CONSTRAINT "fk_process_collection_id" FOREIGN KEY ("process_collection") REFERENCES "process_collection"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process" ADD CONSTRAINT "fk_process_tenant_id" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process" ADD CONSTRAINT "fk_process_output_type" FOREIGN KEY ("output_type") REFERENCES "process_output"("type") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process_collection" ADD CONSTRAINT "fk_process_collection_created_by" FOREIGN KEY ("created_by") REFERENCES "jhi_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process_collection" ADD CONSTRAINT "fk_process_collection_parent_id" FOREIGN KEY ("parent_id") REFERENCES "process_collection"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process_collection" ADD CONSTRAINT "fk_process_collection_tenant_id" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}