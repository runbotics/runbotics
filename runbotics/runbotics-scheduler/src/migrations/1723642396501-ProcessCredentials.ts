import { MigrationInterface, QueryRunner } from "typeorm";

export class ProcessCredentials1723642396501 implements MigrationInterface {
    name = 'ProcessCredentials1723642396501'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "scheduler"."process_credential" ("process_id" bigint NOT NULL, "credential_id" uuid NOT NULL, CONSTRAINT "PK_c8c147a6db1c3b2dd7cf8d8c4b0" PRIMARY KEY ("process_id", "credential_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ad32ad8114ed1f6603ff6fb7c9" ON "scheduler"."process_credential" ("process_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_588ebc19945e3b661e15dd1fec" ON "scheduler"."process_credential" ("credential_id") `);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_credential" ADD CONSTRAINT "FK_ad32ad8114ed1f6603ff6fb7c9d" FOREIGN KEY ("process_id") REFERENCES "process"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_credential" ADD CONSTRAINT "FK_588ebc19945e3b661e15dd1fece" FOREIGN KEY ("credential_id") REFERENCES "scheduler"."credential"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scheduler"."process_credential" DROP CONSTRAINT "FK_588ebc19945e3b661e15dd1fece"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_credential" DROP CONSTRAINT "FK_ad32ad8114ed1f6603ff6fb7c9d"`);
        await queryRunner.query(`DROP INDEX "scheduler"."IDX_588ebc19945e3b661e15dd1fec"`);
        await queryRunner.query(`DROP INDEX "scheduler"."IDX_ad32ad8114ed1f6603ff6fb7c9"`);
        await queryRunner.query(`DROP TABLE "scheduler"."process_credential"`);
    }

}
