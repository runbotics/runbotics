import { MigrationInterface, QueryRunner } from "typeorm";

export class EmailUnique1733152928165 implements MigrationInterface {
    name = 'EmailUnique1733152928165'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "jhi_user" ADD CONSTRAINT "UQ_66bf9edbe48673c9c37f4cacce9" UNIQUE ("email")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "jhi_user" DROP CONSTRAINT "UQ_66bf9edbe48673c9c37f4cacce9"`);
    }

}
