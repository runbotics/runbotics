import { MigrationInterface, QueryRunner } from "typeorm";

export class Actions1738082751438 implements MigrationInterface {
    name = 'Actions1738082751438'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "action" ADD "credentialType" character varying(255) NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "action" DROP COLUMN "credentialType"`);
    }

}
