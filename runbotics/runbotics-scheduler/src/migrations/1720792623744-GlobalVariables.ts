import { MigrationInterface, QueryRunner } from "typeorm";

export class GlobalVariables1720792623744 implements MigrationInterface {
    name = 'GlobalVariables1720792623744'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "global_variable" DROP CONSTRAINT "fk_global_variable_user_id"`);
        await queryRunner.query(`ALTER TABLE "global_variable" DROP CONSTRAINT "fk_global_variable_creator_id"`);
        await queryRunner.query(`ALTER TABLE "global_variable" DROP CONSTRAINT "fk_global_variable_tenant_id"`);
        await queryRunner.query(`ALTER TABLE "global_variable" ALTER COLUMN "name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "global_variable" ALTER COLUMN "type" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "global_variable" ALTER COLUMN "value" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "global_variable" ALTER COLUMN "last_modified" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "global_variable" ALTER COLUMN "last_modified" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "global_variable" ALTER COLUMN "tenant_id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "global_variable" ADD CONSTRAINT "FK_a4e5405474004354ba528a2a618" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "global_variable" ADD CONSTRAINT "FK_f7f60cbffa00fac43994c8579a2" FOREIGN KEY ("creator_id") REFERENCES "jhi_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "global_variable" ADD CONSTRAINT "FK_d788e3f314f9ea5ec0a8757ecec" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "global_variable" DROP CONSTRAINT "FK_d788e3f314f9ea5ec0a8757ecec"`);
        await queryRunner.query(`ALTER TABLE "global_variable" DROP CONSTRAINT "FK_f7f60cbffa00fac43994c8579a2"`);
        await queryRunner.query(`ALTER TABLE "global_variable" DROP CONSTRAINT "FK_a4e5405474004354ba528a2a618"`);
        await queryRunner.query(`ALTER TABLE "global_variable" ALTER COLUMN "tenant_id" SET DEFAULT 'b7f9092f-5973-c781-08db-4d6e48f78e98'`);
        await queryRunner.query(`ALTER TABLE "global_variable" ALTER COLUMN "last_modified" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "global_variable" ALTER COLUMN "last_modified" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "global_variable" ALTER COLUMN "value" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "global_variable" ALTER COLUMN "type" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "global_variable" ALTER COLUMN "name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "global_variable" ADD CONSTRAINT "fk_global_variable_tenant_id" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "global_variable" ADD CONSTRAINT "fk_global_variable_creator_id" FOREIGN KEY ("creator_id") REFERENCES "jhi_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "global_variable" ADD CONSTRAINT "fk_global_variable_user_id" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
