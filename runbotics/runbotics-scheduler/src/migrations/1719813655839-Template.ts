import { MigrationInterface, QueryRunner } from "typeorm";

export class Template1719813655839 implements MigrationInterface {
    name = 'Template1719813655839'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "credential_template_attribute" ALTER COLUMN "description" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "credential_template_attribute" ALTER COLUMN "description" SET NOT NULL`);
    }

}
