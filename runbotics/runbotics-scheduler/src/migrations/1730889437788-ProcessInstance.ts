import { MigrationInterface, QueryRunner } from "typeorm";

export class ProcessInstance1730889437788 implements MigrationInterface {
    name = 'ProcessInstance1730889437788'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "process_instance" DROP CONSTRAINT "fk_process_instance_user_id"`);
        await queryRunner.query(`ALTER TABLE "process_instance" DROP CONSTRAINT "fk_process_instance_process_id"`);
        await queryRunner.query(`ALTER TABLE "process_instance" DROP CONSTRAINT "fk_process_instance_bot_id"`);
        await queryRunner.query(`ALTER TABLE "process_instance" DROP CONSTRAINT "fk_process_instance_trigger_event"`);
        await queryRunner.query(`ALTER TABLE "process_instance" DROP CONSTRAINT "fk_process_instance_root_process_instance_id"`);
        await queryRunner.query(`ALTER TABLE "process_instance_event" DROP CONSTRAINT "fk_process_instance_event_process_instance_id"`);
        await queryRunner.query(`ALTER TABLE "process_instance_loop_event" DROP CONSTRAINT "fk_process_instance_loop_event_process_instance_id"`);
        await queryRunner.query(`ALTER TABLE "process_instance" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "process_instance" ALTER COLUMN "user_id" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "process_instance" ADD CONSTRAINT "FK_dff02036200058c562cb7823c64" FOREIGN KEY ("bot_id") REFERENCES "bot"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process_instance" ADD CONSTRAINT "FK_7bad9afa74df3a20bf9d5065a60" FOREIGN KEY ("process_id") REFERENCES "process"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process_instance" ADD CONSTRAINT "FK_e51fd429ba0f14ab2f2af883cd3" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process_instance" ADD CONSTRAINT "FK_b7f7822a062203741cf2ca951be" FOREIGN KEY ("trigger") REFERENCES "trigger_event"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process_instance_event" ADD CONSTRAINT "FK_1f0e5b53e522d2cc60b640897d4" FOREIGN KEY ("process_instance_id") REFERENCES "process_instance"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process_instance_loop_event" ADD CONSTRAINT "FK_2fbbb202f981684be49bf187a27" FOREIGN KEY ("process_instance_id") REFERENCES "process_instance"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "process_instance_loop_event" DROP CONSTRAINT "FK_2fbbb202f981684be49bf187a27"`);
        await queryRunner.query(`ALTER TABLE "process_instance_event" DROP CONSTRAINT "FK_1f0e5b53e522d2cc60b640897d4"`);
        await queryRunner.query(`ALTER TABLE "process_instance" DROP CONSTRAINT "FK_b7f7822a062203741cf2ca951be"`);
        await queryRunner.query(`ALTER TABLE "process_instance" DROP CONSTRAINT "FK_e51fd429ba0f14ab2f2af883cd3"`);
        await queryRunner.query(`ALTER TABLE "process_instance" DROP CONSTRAINT "FK_7bad9afa74df3a20bf9d5065a60"`);
        await queryRunner.query(`ALTER TABLE "process_instance" DROP CONSTRAINT "FK_dff02036200058c562cb7823c64"`);
        await queryRunner.query(`ALTER TABLE "process_instance" ALTER COLUMN "user_id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "process_instance" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "process_instance_loop_event" ADD CONSTRAINT "fk_process_instance_loop_event_process_instance_id" FOREIGN KEY ("process_instance_id") REFERENCES "process_instance"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process_instance_event" ADD CONSTRAINT "fk_process_instance_event_process_instance_id" FOREIGN KEY ("process_instance_id") REFERENCES "process_instance"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process_instance" ADD CONSTRAINT "fk_process_instance_root_process_instance_id" FOREIGN KEY ("root_process_instance_id") REFERENCES "process_instance"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process_instance" ADD CONSTRAINT "fk_process_instance_trigger_event" FOREIGN KEY ("trigger") REFERENCES "trigger_event"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process_instance" ADD CONSTRAINT "fk_process_instance_bot_id" FOREIGN KEY ("bot_id") REFERENCES "bot"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process_instance" ADD CONSTRAINT "fk_process_instance_process_id" FOREIGN KEY ("process_id") REFERENCES "process"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process_instance" ADD CONSTRAINT "fk_process_instance_user_id" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
