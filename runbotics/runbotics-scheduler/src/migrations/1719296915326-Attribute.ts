import { MigrationInterface, QueryRunner } from "typeorm";

export class Attribute1719296915326 implements MigrationInterface {
    name = 'Attribute1719296915326'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scheduler"."attribute" ADD "credential_id" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scheduler"."attribute" DROP COLUMN "credential_id"`);
    }

}
