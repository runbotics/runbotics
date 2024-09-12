import { MigrationInterface, QueryRunner } from "typeorm";

export class ProcessCredentialEntity1724064431315 implements MigrationInterface {
    name = 'ProcessCredentialEntity1724064431315'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scheduler"."process_credential" DROP CONSTRAINT "FK_ad32ad8114ed1f6603ff6fb7c9d"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_credential" DROP CONSTRAINT "FK_588ebc19945e3b661e15dd1fece"`);
        await queryRunner.query(`DROP INDEX "scheduler"."IDX_588ebc19945e3b661e15dd1fec"`);
        await queryRunner.query(`DROP INDEX "scheduler"."IDX_ad32ad8114ed1f6603ff6fb7c9"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_credential" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_credential" DROP CONSTRAINT "PK_c8c147a6db1c3b2dd7cf8d8c4b0"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_credential" ADD CONSTRAINT "PK_55a8aea96b83b51d621e17a06eb" PRIMARY KEY ("process_id", "credential_id", "id")`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_credential" ADD "order" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_credential" DROP CONSTRAINT "PK_55a8aea96b83b51d621e17a06eb"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_credential" ADD CONSTRAINT "PK_714151d7fbb002ef4e21e82acc5" PRIMARY KEY ("credential_id", "id")`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_credential" DROP CONSTRAINT "PK_714151d7fbb002ef4e21e82acc5"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_credential" ADD CONSTRAINT "PK_e63441f2044b8354aa4fe422c49" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_credential" ADD CONSTRAINT "FK_ad32ad8114ed1f6603ff6fb7c9d" FOREIGN KEY ("process_id") REFERENCES "process"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_credential" ADD CONSTRAINT "FK_588ebc19945e3b661e15dd1fece" FOREIGN KEY ("credential_id") REFERENCES "scheduler"."credential"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scheduler"."process_credential" DROP CONSTRAINT "FK_588ebc19945e3b661e15dd1fece"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_credential" DROP CONSTRAINT "FK_ad32ad8114ed1f6603ff6fb7c9d"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_credential" DROP CONSTRAINT "PK_e63441f2044b8354aa4fe422c49"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_credential" ADD CONSTRAINT "PK_714151d7fbb002ef4e21e82acc5" PRIMARY KEY ("credential_id", "id")`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_credential" DROP CONSTRAINT "PK_714151d7fbb002ef4e21e82acc5"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_credential" ADD CONSTRAINT "PK_55a8aea96b83b51d621e17a06eb" PRIMARY KEY ("process_id", "credential_id", "id")`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_credential" DROP COLUMN "order"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_credential" DROP CONSTRAINT "PK_55a8aea96b83b51d621e17a06eb"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_credential" ADD CONSTRAINT "PK_c8c147a6db1c3b2dd7cf8d8c4b0" PRIMARY KEY ("process_id", "credential_id")`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_credential" DROP COLUMN "id"`);
        await queryRunner.query(`CREATE INDEX "IDX_ad32ad8114ed1f6603ff6fb7c9" ON "scheduler"."process_credential" ("process_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_588ebc19945e3b661e15dd1fec" ON "scheduler"."process_credential" ("credential_id") `);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_credential" ADD CONSTRAINT "FK_588ebc19945e3b661e15dd1fece" FOREIGN KEY ("credential_id") REFERENCES "scheduler"."credential"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_credential" ADD CONSTRAINT "FK_ad32ad8114ed1f6603ff6fb7c9d" FOREIGN KEY ("process_id") REFERENCES "process"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
