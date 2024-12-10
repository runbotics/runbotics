import { MigrationInterface, QueryRunner } from "typeorm";

export class Cascade1733843426128 implements MigrationInterface {
    name = 'Cascade1733843426128'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bot" DROP CONSTRAINT "FK_a3190460df612af6ab214b44a92"`);
        await queryRunner.query(`ALTER TABLE "bot" DROP CONSTRAINT "FK_5f2d279e977d38b76d3f72c5463"`);
        await queryRunner.query(`ALTER TABLE "bot_collection" DROP CONSTRAINT "FK_259ea10c3617e2c3564d0ead503"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" DROP CONSTRAINT "FK_14c0e239df3748b2a116b22ba9b"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential" DROP CONSTRAINT "FK_94262abd8352fd19e4c500fff82"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential" DROP CONSTRAINT "FK_8928d022104b6c32bc3923e12ea"`);
        await queryRunner.query(`ALTER TABLE "process_collection" DROP CONSTRAINT "FK_3c30da520c249192c358cf4beb3"`);
        await queryRunner.query(`ALTER TABLE "process" DROP CONSTRAINT "FK_dcbb6d9efab53e5cd77d114ff92"`);
        await queryRunner.query(`ALTER TABLE "process" DROP CONSTRAINT "FK_142e8f5a02f9a4789c1fb5fe1e0"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_context" DROP CONSTRAINT "FK_2436e0d0185232f33d7de31be33"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_context_secret" DROP CONSTRAINT "FK_4c84d7884afcc4821043408b2ea"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_context_secret" DROP CONSTRAINT "FK_73e3b1df07fd1015969f9b9b513"`);
        await queryRunner.query(`ALTER TABLE "process_instance" DROP CONSTRAINT "FK_b7f7822a062203741cf2ca951be"`);
        await queryRunner.query(`ALTER TABLE "guest" DROP CONSTRAINT "FK_6e15557f006bedc89949a47c64d"`);
        await queryRunner.query(`ALTER TABLE "tag_process" DROP CONSTRAINT "FK_672ac265ecfeaa72a2b7fda918b"`);
        await queryRunner.query(`ALTER TABLE "process" ALTER COLUMN "updated" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "bot" ADD CONSTRAINT "FK_a3190460df612af6ab214b44a92" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bot" ADD CONSTRAINT "FK_5f2d279e977d38b76d3f72c5463" FOREIGN KEY ("collection_id") REFERENCES "bot_collection"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bot_collection" ADD CONSTRAINT "FK_259ea10c3617e2c3564d0ead503" FOREIGN KEY ("created_by") REFERENCES "jhi_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" ADD CONSTRAINT "FK_14c0e239df3748b2a116b22ba9b" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential" ADD CONSTRAINT "FK_8928d022104b6c32bc3923e12ea" FOREIGN KEY ("collection_id") REFERENCES "scheduler"."credential_collection"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential" ADD CONSTRAINT "FK_94262abd8352fd19e4c500fff82" FOREIGN KEY ("template_id") REFERENCES "scheduler"."credential_template"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process_collection" ADD CONSTRAINT "FK_3c30da520c249192c358cf4beb3" FOREIGN KEY ("parent_id") REFERENCES "process_collection"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process" ADD CONSTRAINT "FK_dcbb6d9efab53e5cd77d114ff92" FOREIGN KEY ("output_type") REFERENCES "process_output"("type") ON DELETE NO ACTION ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "process" ADD CONSTRAINT "FK_142e8f5a02f9a4789c1fb5fe1e0" FOREIGN KEY ("process_collection") REFERENCES "process_collection"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_context" ADD CONSTRAINT "FK_2436e0d0185232f33d7de31be33" FOREIGN KEY ("process_id") REFERENCES "process"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_context_secret" ADD CONSTRAINT "FK_4c84d7884afcc4821043408b2ea" FOREIGN KEY ("process_context_id") REFERENCES "scheduler"."process_context"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_context_secret" ADD CONSTRAINT "FK_73e3b1df07fd1015969f9b9b513" FOREIGN KEY ("secret_id") REFERENCES "scheduler"."secret"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process_instance" ADD CONSTRAINT "FK_b7f7822a062203741cf2ca951be" FOREIGN KEY ("trigger") REFERENCES "trigger_event"("name") ON DELETE NO ACTION ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "guest" ADD CONSTRAINT "FK_6e15557f006bedc89949a47c64d" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tag_process" ADD CONSTRAINT "FK_672ac265ecfeaa72a2b7fda918b" FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tag_process" DROP CONSTRAINT "FK_672ac265ecfeaa72a2b7fda918b"`);
        await queryRunner.query(`ALTER TABLE "guest" DROP CONSTRAINT "FK_6e15557f006bedc89949a47c64d"`);
        await queryRunner.query(`ALTER TABLE "process_instance" DROP CONSTRAINT "FK_b7f7822a062203741cf2ca951be"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_context_secret" DROP CONSTRAINT "FK_73e3b1df07fd1015969f9b9b513"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_context_secret" DROP CONSTRAINT "FK_4c84d7884afcc4821043408b2ea"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_context" DROP CONSTRAINT "FK_2436e0d0185232f33d7de31be33"`);
        await queryRunner.query(`ALTER TABLE "process" DROP CONSTRAINT "FK_142e8f5a02f9a4789c1fb5fe1e0"`);
        await queryRunner.query(`ALTER TABLE "process" DROP CONSTRAINT "FK_dcbb6d9efab53e5cd77d114ff92"`);
        await queryRunner.query(`ALTER TABLE "process_collection" DROP CONSTRAINT "FK_3c30da520c249192c358cf4beb3"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential" DROP CONSTRAINT "FK_94262abd8352fd19e4c500fff82"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential" DROP CONSTRAINT "FK_8928d022104b6c32bc3923e12ea"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" DROP CONSTRAINT "FK_14c0e239df3748b2a116b22ba9b"`);
        await queryRunner.query(`ALTER TABLE "bot_collection" DROP CONSTRAINT "FK_259ea10c3617e2c3564d0ead503"`);
        await queryRunner.query(`ALTER TABLE "bot" DROP CONSTRAINT "FK_5f2d279e977d38b76d3f72c5463"`);
        await queryRunner.query(`ALTER TABLE "bot" DROP CONSTRAINT "FK_a3190460df612af6ab214b44a92"`);
        await queryRunner.query(`ALTER TABLE "process" ALTER COLUMN "updated" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "tag_process" ADD CONSTRAINT "FK_672ac265ecfeaa72a2b7fda918b" FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "guest" ADD CONSTRAINT "FK_6e15557f006bedc89949a47c64d" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process_instance" ADD CONSTRAINT "FK_b7f7822a062203741cf2ca951be" FOREIGN KEY ("trigger") REFERENCES "trigger_event"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_context_secret" ADD CONSTRAINT "FK_73e3b1df07fd1015969f9b9b513" FOREIGN KEY ("secret_id") REFERENCES "scheduler"."secret"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_context_secret" ADD CONSTRAINT "FK_4c84d7884afcc4821043408b2ea" FOREIGN KEY ("process_context_id") REFERENCES "scheduler"."process_context"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_context" ADD CONSTRAINT "FK_2436e0d0185232f33d7de31be33" FOREIGN KEY ("process_id") REFERENCES "process"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process" ADD CONSTRAINT "FK_142e8f5a02f9a4789c1fb5fe1e0" FOREIGN KEY ("process_collection") REFERENCES "process_collection"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process" ADD CONSTRAINT "FK_dcbb6d9efab53e5cd77d114ff92" FOREIGN KEY ("output_type") REFERENCES "process_output"("type") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process_collection" ADD CONSTRAINT "FK_3c30da520c249192c358cf4beb3" FOREIGN KEY ("parent_id") REFERENCES "process_collection"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential" ADD CONSTRAINT "FK_8928d022104b6c32bc3923e12ea" FOREIGN KEY ("collection_id") REFERENCES "scheduler"."credential_collection"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential" ADD CONSTRAINT "FK_94262abd8352fd19e4c500fff82" FOREIGN KEY ("template_id") REFERENCES "scheduler"."credential_template"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" ADD CONSTRAINT "FK_14c0e239df3748b2a116b22ba9b" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bot_collection" ADD CONSTRAINT "FK_259ea10c3617e2c3564d0ead503" FOREIGN KEY ("created_by") REFERENCES "jhi_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bot" ADD CONSTRAINT "FK_5f2d279e977d38b76d3f72c5463" FOREIGN KEY ("collection_id") REFERENCES "bot_collection"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bot" ADD CONSTRAINT "FK_a3190460df612af6ab214b44a92" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
