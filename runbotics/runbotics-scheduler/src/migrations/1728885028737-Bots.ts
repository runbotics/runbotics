import { MigrationInterface, QueryRunner } from "typeorm";

export class Bots1728885028737 implements MigrationInterface {
    name = 'Bots1728885028737'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bot" DROP CONSTRAINT "fk_bot_user_id"`);
        await queryRunner.query(`ALTER TABLE "bot" DROP CONSTRAINT "fk_bot_system"`);
        await queryRunner.query(`ALTER TABLE "bot" DROP CONSTRAINT "fk_bot_collection_id"`);
        await queryRunner.query(`ALTER TABLE "bot_collection" DROP CONSTRAINT "FK_09ce6bcda7f5361c1359004ce1d"`);
        await queryRunner.query(`ALTER TABLE "bot" ADD "tenant_id" uuid NOT NULL DEFAULT 'b7f9092f-5973-c781-08db-4d6e48f78e98'`);
        await queryRunner.query(`ALTER TABLE "bot" ALTER COLUMN "created" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "bot" ADD CONSTRAINT "FK_52208d5c1c54f95568977094c62" FOREIGN KEY ("system") REFERENCES "bot_system"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bot" ADD CONSTRAINT "FK_a3190460df612af6ab214b44a92" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bot" ADD CONSTRAINT "FK_5f2d279e977d38b76d3f72c5463" FOREIGN KEY ("collection_id") REFERENCES "bot_collection"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bot" DROP CONSTRAINT "FK_5f2d279e977d38b76d3f72c5463"`);
        await queryRunner.query(`ALTER TABLE "bot" DROP CONSTRAINT "FK_a3190460df612af6ab214b44a92"`);
        await queryRunner.query(`ALTER TABLE "bot" DROP CONSTRAINT "FK_52208d5c1c54f95568977094c62"`);
        await queryRunner.query(`ALTER TABLE "bot" ALTER COLUMN "created" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "bot" DROP COLUMN "tenant_id"`);
        await queryRunner.query(`ALTER TABLE "bot_collection" ADD CONSTRAINT "FK_09ce6bcda7f5361c1359004ce1d" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bot" ADD CONSTRAINT "fk_bot_collection_id" FOREIGN KEY ("collection_id") REFERENCES "bot_collection"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bot" ADD CONSTRAINT "fk_bot_system" FOREIGN KEY ("system") REFERENCES "bot_system"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bot" ADD CONSTRAINT "fk_bot_user_id" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
