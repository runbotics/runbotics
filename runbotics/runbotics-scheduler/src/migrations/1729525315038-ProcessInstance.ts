import { MigrationInterface, QueryRunner } from "typeorm";

export class ProcessInstance1729525315038 implements MigrationInterface {
    name = 'ProcessInstance1729525315038'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "process_instance" DROP CONSTRAINT "fk_process_instance_user_id"`);
        await queryRunner.query(`ALTER TABLE "process_instance" DROP CONSTRAINT "fk_process_instance_process_id"`);
        await queryRunner.query(`ALTER TABLE "process_instance" DROP CONSTRAINT "fk_process_instance_bot_id"`);
        await queryRunner.query(`ALTER TABLE "process_instance" DROP CONSTRAINT "fk_process_instance_trigger_event"`);
        await queryRunner.query(`ALTER TABLE "process_instance" DROP CONSTRAINT "fk_process_instance_root_process_instance_id"`);
        await queryRunner.query(`ALTER TABLE "process_instance_loop_event" DROP CONSTRAINT "fk_process_instance_loop_event_process_instance_id"`);
        await queryRunner.query(`ALTER TABLE "process_instance_event" DROP CONSTRAINT "fk_process_instance_event_process_instance_id"`);
        await queryRunner.query(`DROP INDEX "public"."process_instance_process_id_idx"`);
        await queryRunner.query(`DROP INDEX "public"."process_instance_root_process_instance_id_idx"`);
        await queryRunner.query(`DROP INDEX "public"."process_instance_loop_execution_id_idx"`);
        await queryRunner.query(`DROP INDEX "public"."process_instance_event_process_instance_id_idx"`);
        await queryRunner.query(`ALTER TABLE "process_instance" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "process_instance" ALTER COLUMN "created" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_instance" ALTER COLUMN "status" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_instance" ALTER COLUMN "updated" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_instance" ALTER COLUMN "process_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_instance" ALTER COLUMN "user_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_instance" ALTER COLUMN "user_id" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "process_instance" ALTER COLUMN "trigger" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_instance" ALTER COLUMN "trigger" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "process_instance" ALTER COLUMN "warning" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_instance_loop_event" ALTER COLUMN "created" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_instance_loop_event" ALTER COLUMN "log" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_instance_loop_event" ALTER COLUMN "script" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_instance_loop_event" DROP CONSTRAINT "process_instance_loop_event_execution_id_key"`);
        await queryRunner.query(`ALTER TABLE "process_instance_loop_event" ALTER COLUMN "input" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_instance_loop_event" ALTER COLUMN "output" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_instance_loop_event" ALTER COLUMN "process_instance_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_instance_loop_event" ALTER COLUMN "finished" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_instance_event" ALTER COLUMN "created" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_instance_event" ALTER COLUMN "log" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_instance_event" ALTER COLUMN "process_instance_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_instance_event" ALTER COLUMN "step" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_instance_event" ALTER COLUMN "execution_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_instance_event" DROP CONSTRAINT "uc_process_instance_event_execid_col"`);
        await queryRunner.query(`ALTER TABLE "process_instance_event" ALTER COLUMN "input" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_instance_event" ALTER COLUMN "output" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_instance_event" ALTER COLUMN "finished" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_instance_event" ALTER COLUMN "status" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_instance" ADD CONSTRAINT "FK_dff02036200058c562cb7823c64" FOREIGN KEY ("bot_id") REFERENCES "bot"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process_instance" ADD CONSTRAINT "FK_7bad9afa74df3a20bf9d5065a60" FOREIGN KEY ("process_id") REFERENCES "process"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process_instance" ADD CONSTRAINT "FK_e51fd429ba0f14ab2f2af883cd3" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE DEFAULT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process_instance_loop_event" ADD CONSTRAINT "FK_2fbbb202f981684be49bf187a27" FOREIGN KEY ("process_instance_id") REFERENCES "process_instance"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process_instance_event" ADD CONSTRAINT "FK_1f0e5b53e522d2cc60b640897d4" FOREIGN KEY ("process_instance_id") REFERENCES "process_instance"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "process_instance_event" DROP CONSTRAINT "FK_1f0e5b53e522d2cc60b640897d4"`);
        await queryRunner.query(`ALTER TABLE "process_instance_loop_event" DROP CONSTRAINT "FK_2fbbb202f981684be49bf187a27"`);
        await queryRunner.query(`ALTER TABLE "process_instance" DROP CONSTRAINT "FK_e51fd429ba0f14ab2f2af883cd3"`);
        await queryRunner.query(`ALTER TABLE "process_instance" DROP CONSTRAINT "FK_7bad9afa74df3a20bf9d5065a60"`);
        await queryRunner.query(`ALTER TABLE "process_instance" DROP CONSTRAINT "FK_dff02036200058c562cb7823c64"`);
        await queryRunner.query(`ALTER TABLE "process_instance_event" ALTER COLUMN "status" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_instance_event" ALTER COLUMN "finished" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_instance_event" ALTER COLUMN "output" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_instance_event" ALTER COLUMN "input" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_instance_event" ADD CONSTRAINT "uc_process_instance_event_execid_col" UNIQUE ("execution_id")`);
        await queryRunner.query(`ALTER TABLE "process_instance_event" ALTER COLUMN "execution_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_instance_event" ALTER COLUMN "step" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_instance_event" ALTER COLUMN "process_instance_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_instance_event" ALTER COLUMN "log" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_instance_event" ALTER COLUMN "created" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_instance_loop_event" ALTER COLUMN "finished" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_instance_loop_event" ALTER COLUMN "process_instance_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_instance_loop_event" ALTER COLUMN "output" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_instance_loop_event" ALTER COLUMN "input" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_instance_loop_event" ADD CONSTRAINT "process_instance_loop_event_execution_id_key" UNIQUE ("execution_id")`);
        await queryRunner.query(`ALTER TABLE "process_instance_loop_event" ALTER COLUMN "script" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_instance_loop_event" ALTER COLUMN "log" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_instance_loop_event" ALTER COLUMN "created" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_instance" ALTER COLUMN "warning" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_instance" ALTER COLUMN "trigger" SET DEFAULT 'MANUAL'`);
        await queryRunner.query(`ALTER TABLE "process_instance" ALTER COLUMN "trigger" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_instance" ALTER COLUMN "user_id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "process_instance" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_instance" ALTER COLUMN "process_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_instance" ALTER COLUMN "updated" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_instance" ALTER COLUMN "status" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_instance" ALTER COLUMN "created" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_instance" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`CREATE INDEX "process_instance_event_process_instance_id_idx" ON "process_instance_event" ("process_instance_id") `);
        await queryRunner.query(`CREATE INDEX "process_instance_loop_execution_id_idx" ON "process_instance_loop_event" ("execution_id") `);
        await queryRunner.query(`CREATE INDEX "process_instance_root_process_instance_id_idx" ON "process_instance" ("root_process_instance_id") `);
        await queryRunner.query(`CREATE INDEX "process_instance_process_id_idx" ON "process_instance" ("process_id") `);
        await queryRunner.query(`ALTER TABLE "process_instance_event" ADD CONSTRAINT "fk_process_instance_event_process_instance_id" FOREIGN KEY ("process_instance_id") REFERENCES "process_instance"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process_instance_loop_event" ADD CONSTRAINT "fk_process_instance_loop_event_process_instance_id" FOREIGN KEY ("process_instance_id") REFERENCES "process_instance"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process_instance" ADD CONSTRAINT "fk_process_instance_root_process_instance_id" FOREIGN KEY ("root_process_instance_id") REFERENCES "process_instance"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process_instance" ADD CONSTRAINT "fk_process_instance_trigger_event" FOREIGN KEY ("trigger") REFERENCES "trigger_event"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process_instance" ADD CONSTRAINT "fk_process_instance_bot_id" FOREIGN KEY ("bot_id") REFERENCES "bot"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process_instance" ADD CONSTRAINT "fk_process_instance_process_id" FOREIGN KEY ("process_id") REFERENCES "process"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process_instance" ADD CONSTRAINT "fk_process_instance_user_id" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
