import { MigrationInterface, QueryRunner } from "typeorm";

export class Actions1737471544919 implements MigrationInterface {
    name = 'Actions1737471544919'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "action" ADD "credentialType" character varying(255) NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "action" DROP COLUMN "credentialType"`);
    }

}
