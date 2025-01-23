import { MigrationInterface, QueryRunner } from "typeorm";

export class ProcessCollection1737470036305 implements MigrationInterface {
    name = 'ProcessCollection1737470036305'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "process_collection" DROP CONSTRAINT "FK_3c30da520c249192c358cf4beb3"`);
        await queryRunner.query(`ALTER TABLE "process_collection" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_collection" ADD CONSTRAINT "FK_3c30da520c249192c358cf4beb3" FOREIGN KEY ("parent_id") REFERENCES "process_collection"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process_collection" ADD CONSTRAINT "FK_de0aba3344d22a98f3a3820081f" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "process_collection" DROP CONSTRAINT "FK_de0aba3344d22a98f3a3820081f"`);
        await queryRunner.query(`ALTER TABLE "process_collection" DROP CONSTRAINT "FK_3c30da520c249192c358cf4beb3"`);
        await queryRunner.query(`ALTER TABLE "process_collection" ALTER COLUMN "description" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "process_collection" ADD CONSTRAINT "FK_3c30da520c249192c358cf4beb3" FOREIGN KEY ("parent_id") REFERENCES "process_collection"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
