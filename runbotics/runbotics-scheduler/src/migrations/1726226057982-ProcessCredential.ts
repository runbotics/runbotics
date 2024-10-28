import { MigrationInterface, QueryRunner } from "typeorm";

export class ProcessCredential1726226057982 implements MigrationInterface {
    name = 'ProcessCredential1726226057982'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scheduler"."process_credential" DROP CONSTRAINT "FK_ad32ad8114ed1f6603ff6fb7c9d"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_credential" DROP CONSTRAINT "FK_588ebc19945e3b661e15dd1fece"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_credential" ADD CONSTRAINT "FK_ad32ad8114ed1f6603ff6fb7c9d" FOREIGN KEY ("process_id") REFERENCES "process"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_credential" ADD CONSTRAINT "FK_588ebc19945e3b661e15dd1fece" FOREIGN KEY ("credential_id") REFERENCES "scheduler"."credential"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scheduler"."process_credential" DROP CONSTRAINT "FK_588ebc19945e3b661e15dd1fece"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_credential" DROP CONSTRAINT "FK_ad32ad8114ed1f6603ff6fb7c9d"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_credential" ADD CONSTRAINT "FK_588ebc19945e3b661e15dd1fece" FOREIGN KEY ("credential_id") REFERENCES "scheduler"."credential"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_credential" ADD CONSTRAINT "FK_ad32ad8114ed1f6603ff6fb7c9d" FOREIGN KEY ("process_id") REFERENCES "process"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
