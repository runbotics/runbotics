import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProcessSnapshot1762258089000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "process_snapshot" (
                "id" bigserial PRIMARY KEY,
                "process_id" bigint NOT NULL,
                "version_number" integer NOT NULL,
                "name" varchar(255) NOT NULL,
                "description" text,
                "process_definition" bytea NOT NULL,
                "created_by_id" bigint NOT NULL,
                "created_at" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        await queryRunner.query(`
            CREATE UNIQUE INDEX "UQ_process_snapshot_process_version" ON "process_snapshot" ("process_id", "version_number")
        `);

        await queryRunner.query(`
            ALTER TABLE "process_snapshot" 
            ADD CONSTRAINT "FK_process_snapshot_process" 
            FOREIGN KEY ("process_id") REFERENCES "process"("id") 
            ON DELETE CASCADE
        `);

        await queryRunner.query(`
            ALTER TABLE "process_snapshot" 
            ADD CONSTRAINT "FK_process_snapshot_created_by" 
            FOREIGN KEY ("created_by_id") REFERENCES "jhi_user"("id") 
            ON DELETE RESTRICT
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "process_snapshot"`);
    }
}
