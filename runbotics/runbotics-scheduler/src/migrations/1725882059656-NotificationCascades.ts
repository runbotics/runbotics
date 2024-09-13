import { MigrationInterface, QueryRunner } from "typeorm";

export class NotificationCascades1725882059656 implements MigrationInterface {
    name = 'NotificationCascades1725882059656'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification_process" DROP CONSTRAINT "FK_e1a2280a824e267cdb588c74bd9"`);
        await queryRunner.query(`ALTER TABLE "notification_process" DROP CONSTRAINT "FK_7b592798f4addb0d321581b70ba"`);
        await queryRunner.query(`ALTER TABLE "notification_bot" DROP CONSTRAINT "FK_63e8bb25d071a7bbd6b80b2503a"`);
        await queryRunner.query(`ALTER TABLE "notification_bot" DROP CONSTRAINT "FK_7b63cf21b9a8d158b61d4358abe"`);
        await queryRunner.query(`ALTER TABLE "notification_process" ADD CONSTRAINT "FK_e1a2280a824e267cdb588c74bd9" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification_process" ADD CONSTRAINT "FK_7b592798f4addb0d321581b70ba" FOREIGN KEY ("process_id") REFERENCES "process"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification_bot" ADD CONSTRAINT "FK_63e8bb25d071a7bbd6b80b2503a" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification_bot" ADD CONSTRAINT "FK_7b63cf21b9a8d158b61d4358abe" FOREIGN KEY ("bot_id") REFERENCES "bot"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification_bot" DROP CONSTRAINT "FK_7b63cf21b9a8d158b61d4358abe"`);
        await queryRunner.query(`ALTER TABLE "notification_bot" DROP CONSTRAINT "FK_63e8bb25d071a7bbd6b80b2503a"`);
        await queryRunner.query(`ALTER TABLE "notification_process" DROP CONSTRAINT "FK_7b592798f4addb0d321581b70ba"`);
        await queryRunner.query(`ALTER TABLE "notification_process" DROP CONSTRAINT "FK_e1a2280a824e267cdb588c74bd9"`);
        await queryRunner.query(`ALTER TABLE "notification_bot" ADD CONSTRAINT "FK_7b63cf21b9a8d158b61d4358abe" FOREIGN KEY ("bot_id") REFERENCES "bot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification_bot" ADD CONSTRAINT "FK_63e8bb25d071a7bbd6b80b2503a" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification_process" ADD CONSTRAINT "FK_7b592798f4addb0d321581b70ba" FOREIGN KEY ("process_id") REFERENCES "process"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification_process" ADD CONSTRAINT "FK_e1a2280a824e267cdb588c74bd9" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
