import { MigrationInterface, QueryRunner } from "typeorm";

export class GlobalVariablesUniqueNameInTenant1721647191780 implements MigrationInterface {
    name = 'GlobalVariablesUniqueNameInTenant1721647191780'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "global_variable" ADD CONSTRAINT "UQ_61b5aa807e2a51f3e14bb843ea6" UNIQUE ("name", "tenant_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "global_variable" DROP CONSTRAINT "UQ_61b5aa807e2a51f3e14bb843ea6"`);
    }

}
