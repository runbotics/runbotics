import { MigrationInterface, QueryRunner } from "typeorm"

export class Notifications1722934562965 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification_process" DROP CONSTRAINT "fk_user_id_notification_process"`);
        await queryRunner.query(`ALTER TABLE "notification_process" DROP CONSTRAINT "fk_process_id_notification_process"`);
        await queryRunner.query(`ALTER TABLE "notification_process" DROP CONSTRAINT "fk_type_notification_process"`);
        await queryRunner.query(`ALTER TABLE "notification_bot" DROP CONSTRAINT "fk_user_id_notification_bot"`);
        await queryRunner.query(`ALTER TABLE "notification_bot" DROP CONSTRAINT "fk_bot_id_notification_bot"`);
        await queryRunner.query(`ALTER TABLE "notification_bot" DROP CONSTRAINT "fk_type_notification_bot"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e1a2280a824e267cdb588c74bd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7b592798f4addb0d321581b70b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_63e8bb25d071a7bbd6b80b2503"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7b63cf21b9a8d158b61d4358ab"`);
        await queryRunner.query(`ALTER TABLE "notification_process" ADD CONSTRAINT "UQ_1c614e65e2b3d2887977548f469" UNIQUE ("user_id", "process_id", "type")`);
        await queryRunner.query(`ALTER TABLE "notification_bot" ADD CONSTRAINT "UQ_05d078e13878fa287d55aa23b74" UNIQUE ("user_id", "bot_id", "type")`);
        await queryRunner.query(`ALTER TABLE "notification_process" ADD CONSTRAINT "FK_e1a2280a824e267cdb588c74bd9" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification_process" ADD CONSTRAINT "FK_7b592798f4addb0d321581b70ba" FOREIGN KEY ("process_id") REFERENCES "process"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification_bot" ADD CONSTRAINT "FK_63e8bb25d071a7bbd6b80b2503a" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification_bot" ADD CONSTRAINT "FK_7b63cf21b9a8d158b61d4358abe" FOREIGN KEY ("bot_id") REFERENCES "bot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification_bot" DROP CONSTRAINT "FK_7b63cf21b9a8d158b61d4358abe"`);
        await queryRunner.query(`ALTER TABLE "notification_bot" DROP CONSTRAINT "FK_63e8bb25d071a7bbd6b80b2503a"`);
        await queryRunner.query(`ALTER TABLE "notification_process" DROP CONSTRAINT "FK_7b592798f4addb0d321581b70ba"`);
        await queryRunner.query(`ALTER TABLE "notification_process" DROP CONSTRAINT "FK_e1a2280a824e267cdb588c74bd9"`);
        await queryRunner.query(`ALTER TABLE "notification_bot" DROP CONSTRAINT "UQ_05d078e13878fa287d55aa23b74"`);
        await queryRunner.query(`ALTER TABLE "notification_process" DROP CONSTRAINT "UQ_1c614e65e2b3d2887977548f469"`);
        await queryRunner.query(`CREATE INDEX "IDX_7b63cf21b9a8d158b61d4358ab" ON "notification_bot" ("bot_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_63e8bb25d071a7bbd6b80b2503" ON "notification_bot" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_7b592798f4addb0d321581b70b" ON "notification_process" ("process_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_e1a2280a824e267cdb588c74bd" ON "notification_process" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "notification_bot" ADD CONSTRAINT "fk_type_notification_bot" FOREIGN KEY ("type") REFERENCES "notification_type"("type") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification_bot" ADD CONSTRAINT "fk_bot_id_notification_bot" FOREIGN KEY ("bot_id") REFERENCES "bot"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification_bot" ADD CONSTRAINT "fk_user_id_notification_bot" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification_process" ADD CONSTRAINT "fk_type_notification_process" FOREIGN KEY ("type") REFERENCES "notification_type"("type") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification_process" ADD CONSTRAINT "fk_process_id_notification_process" FOREIGN KEY ("process_id") REFERENCES "process"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification_process" ADD CONSTRAINT "fk_user_id_notification_process" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
