import { MigrationInterface, QueryRunner } from "typeorm";

export class ScheduleProcess1725287763452 implements MigrationInterface {
    name = 'ScheduleProcess1725287763452'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "schedule_process" DROP CONSTRAINT "fk_schedule_process_user_id"`);
        await queryRunner.query(`ALTER TABLE "schedule_process" DROP CONSTRAINT "fk_schedule_process_process_id"`);
        await queryRunner.query(`ALTER TABLE "schedule_process" ALTER COLUMN "user_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "schedule_process" ALTER COLUMN "user_id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "schedule_process" ADD CONSTRAINT "FK_a67a1ef8e8144f2d0551cdf469c" FOREIGN KEY ("process_id") REFERENCES "process"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "schedule_process" ADD CONSTRAINT "FK_f1b3fb6941411a5555f74566021" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "schedule_process" DROP CONSTRAINT "FK_f1b3fb6941411a5555f74566021"`);
        await queryRunner.query(`ALTER TABLE "schedule_process" DROP CONSTRAINT "FK_a67a1ef8e8144f2d0551cdf469c"`);
        await queryRunner.query(`ALTER TABLE "schedule_process" ALTER COLUMN "user_id" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "schedule_process" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "schedule_process" ADD CONSTRAINT "fk_schedule_process_process_id" FOREIGN KEY ("process_id") REFERENCES "process"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "schedule_process" ADD CONSTRAINT "fk_schedule_process_user_id" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
