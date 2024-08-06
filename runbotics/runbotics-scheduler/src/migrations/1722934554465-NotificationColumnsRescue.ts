import { MigrationInterface, QueryRunner } from "typeorm"

export class NotificationColumnsRescue1722934554465 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification_bot" DROP CONSTRAINT "FK_63e8bb25d071a7bbd6b80b2503a"`);
        await queryRunner.query(`ALTER TABLE "notification_bot" DROP CONSTRAINT "FK_7b63cf21b9a8d158b61d4358abe"`);

        await queryRunner.query(`ALTER TABLE "notification_process" DROP CONSTRAINT "FK_e1a2280a824e267cdb588c74bd9"`);
        await queryRunner.query(`ALTER TABLE "notification_process" DROP CONSTRAINT "FK_7b592798f4addb0d321581b70ba"`);

        await queryRunner.query(`ALTER TABLE "notification_bot" DROP CONSTRAINT "PK_758fa16a3a1cd435f4e95dee020"`);
        await queryRunner.query(`ALTER TABLE "notification_process" DROP CONSTRAINT "PK_3c678904d9bfedf7069902ed199"`);
        await queryRunner.query(`ALTER TABLE "notification_bot" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "notification_bot" ADD "type" character varying(50) NOT NULL DEFAULT 'BOT_DISCONNECTED'`);
        await queryRunner.query(`ALTER TABLE "notification_bot" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "notification_bot" ADD CONSTRAINT "notification_bot_pkey" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "notification_process" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "notification_process" ADD "type" character varying(50) NOT NULL DEFAULT 'PROCESS_ERROR'`);
        await queryRunner.query(`ALTER TABLE "notification_process" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "notification_process" ADD CONSTRAINT "notification_process_pkey" PRIMARY KEY ("id")`);

        await queryRunner.query(`ALTER TABLE "notification_bot" ADD CONSTRAINT "fk_bot_id_notification_bot" FOREIGN KEY ("bot_id") REFERENCES "bot"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification_bot" ADD CONSTRAINT "fk_user_id_notification_bot" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification_bot" ADD CONSTRAINT "fk_type_notification_bot" FOREIGN KEY ("type") REFERENCES "notification_type"("type") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`ALTER TABLE "notification_process" ADD CONSTRAINT "fk_process_id_notification_process" FOREIGN KEY ("process_id") REFERENCES "process"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification_process" ADD CONSTRAINT "fk_user_id_notification_process" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification_process" ADD CONSTRAINT "fk_type_notification_process" FOREIGN KEY ("type") REFERENCES "notification_type"("type") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification_process" DROP CONSTRAINT "fk_type_notification_process"`);
        await queryRunner.query(`ALTER TABLE "notification_process" DROP CONSTRAINT "fk_user_id_notification_process"`);
        await queryRunner.query(`ALTER TABLE "notification_process" DROP CONSTRAINT "fk_process_id_notification_process"`);

        await queryRunner.query(`ALTER TABLE "notification_bot" DROP CONSTRAINT "fk_type_notification_bot"`);
        await queryRunner.query(`ALTER TABLE "notification_bot" DROP CONSTRAINT "fk_user_id_notification_bot"`);
        await queryRunner.query(`ALTER TABLE "notification_bot" DROP CONSTRAINT "fk_bot_id_notification_bot"`);

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

        await queryRunner.query(`ALTER TABLE "notification_process" ADD CONSTRAINT "FK_7b592798f4addb0d321581b70ba" FOREIGN KEY ("process_id") REFERENCES "process"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "notification_process" ADD CONSTRAINT "FK_e1a2280a824e267cdb588c74bd9" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);

        await queryRunner.query(`ALTER TABLE "notification_bot" ADD CONSTRAINT "FK_7b63cf21b9a8d158b61d4358abe" FOREIGN KEY ("bot_id") REFERENCES "bot"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "notification_bot" ADD CONSTRAINT "FK_63e8bb25d071a7bbd6b80b2503a" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
