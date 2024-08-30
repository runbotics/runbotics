import { MigrationInterface, QueryRunner } from "typeorm";

export class Actions1725002565638 implements MigrationInterface {
    name = 'Actions1725002565638'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "action" ALTER COLUMN "label" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "action" ALTER COLUMN "form" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "action" ALTER COLUMN "script" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "action" ALTER COLUMN "script" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "action" ALTER COLUMN "form" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "action" ALTER COLUMN "label" DROP NOT NULL`);
    }

}
