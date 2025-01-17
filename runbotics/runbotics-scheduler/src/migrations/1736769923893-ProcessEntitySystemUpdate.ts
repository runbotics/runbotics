import { MigrationInterface, QueryRunner } from "typeorm";

export class ProcessEntitySystemUpdate1736769923893 implements MigrationInterface {
    name = 'ProcessEntitySystemUpdate1736769923893'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "process" DROP CONSTRAINT "FK_5bfe818fdb876e108244990655e"`);
        await queryRunner.query(`ALTER TABLE "process" ALTER COLUMN "system" SET DEFAULT 'ANY'`);
        await queryRunner.query(`ALTER TABLE "process" ADD CONSTRAINT "FK_5bfe818fdb876e108244990655e" FOREIGN KEY ("system") REFERENCES "bot_system"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "process" DROP CONSTRAINT "FK_5bfe818fdb876e108244990655e"`);
        await queryRunner.query(`ALTER TABLE "process" ALTER COLUMN "system" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "process" ADD CONSTRAINT "FK_5bfe818fdb876e108244990655e" FOREIGN KEY ("system") REFERENCES "bot_system"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
