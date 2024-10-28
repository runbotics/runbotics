import { MigrationInterface, QueryRunner } from "typeorm"

export class GlobalVariablesProcess1722934541675 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "process_global_variable" DROP CONSTRAINT "fk_process_global_variable_process_id"`);
        await queryRunner.query(`ALTER TABLE "process_global_variable" DROP CONSTRAINT "fk_process_global_variable_global_variable_id"`);
        await queryRunner.query(`CREATE INDEX "IDX_a5c44b5b12113dbd973043fb6b" ON "process_global_variable" ("process_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_b6660b0a9bcd79f1fe11e34ac4" ON "process_global_variable" ("global_variable_id") `);
        await queryRunner.query(`ALTER TABLE "process_global_variable" ADD CONSTRAINT "FK_a5c44b5b12113dbd973043fb6ba" FOREIGN KEY ("process_id") REFERENCES "process"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "process_global_variable" ADD CONSTRAINT "FK_b6660b0a9bcd79f1fe11e34ac4a" FOREIGN KEY ("global_variable_id") REFERENCES "global_variable"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "process_global_variable" DROP CONSTRAINT "FK_b6660b0a9bcd79f1fe11e34ac4a"`);
        await queryRunner.query(`ALTER TABLE "process_global_variable" DROP CONSTRAINT "FK_a5c44b5b12113dbd973043fb6ba"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b6660b0a9bcd79f1fe11e34ac4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a5c44b5b12113dbd973043fb6b"`);
        await queryRunner.query(`ALTER TABLE "process_global_variable" ADD CONSTRAINT "fk_process_global_variable_global_variable_id" FOREIGN KEY ("global_variable_id") REFERENCES "global_variable"("id") ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "process_global_variable" ADD CONSTRAINT "fk_process_global_variable_process_id" FOREIGN KEY ("process_id") REFERENCES "process"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
