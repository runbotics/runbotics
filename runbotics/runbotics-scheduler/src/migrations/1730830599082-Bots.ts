import { MigrationInterface, QueryRunner } from "typeorm";

export class Bots1730830599082 implements MigrationInterface {
    name = 'Bots1730830599082'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bot" DROP CONSTRAINT "fk_bot_user_id"`);
        await queryRunner.query(`ALTER TABLE "bot" DROP CONSTRAINT "fk_bot_system"`);
        await queryRunner.query(`ALTER TABLE "bot" DROP CONSTRAINT "fk_bot_collection_id"`);
        await queryRunner.query(`ALTER TABLE "bot_collection" DROP CONSTRAINT "fk_bot_collection_created_by"`);
        await queryRunner.query(`ALTER TABLE "bot_collection" DROP CONSTRAINT "fk_bot_collection_tenant_id"`);
        await queryRunner.query(`ALTER TABLE "bot" ADD "tenant_id" uuid NOT NULL DEFAULT 'b7f9092f-5973-c781-08db-4d6e48f78e98'`);
        await queryRunner.query(`ALTER TABLE "bot" ALTER COLUMN "created" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "process" DROP CONSTRAINT "FK_ab868b32a58c6512b68b9960bb8"`);
        await queryRunner.query(`ALTER TABLE "bot_collection_user" DROP CONSTRAINT "FK_84c327d024fd89e6d221a067ea6"`);
        await queryRunner.query(`ALTER TABLE "bot_collection" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "bot_collection" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "bot_collection" ALTER COLUMN "created" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "bot_collection" ALTER COLUMN "updated" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "bot" ADD CONSTRAINT "FK_52208d5c1c54f95568977094c62" FOREIGN KEY ("system") REFERENCES "bot_system"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bot" ADD CONSTRAINT "FK_a3190460df612af6ab214b44a92" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bot" ADD CONSTRAINT "FK_5f2d279e977d38b76d3f72c5463" FOREIGN KEY ("collection_id") REFERENCES "bot_collection"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bot_collection" ADD CONSTRAINT "FK_259ea10c3617e2c3564d0ead503" FOREIGN KEY ("created_by") REFERENCES "jhi_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process" ADD CONSTRAINT "FK_ab868b32a58c6512b68b9960bb8" FOREIGN KEY ("bot_collection") REFERENCES "bot_collection"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bot_collection_user" ADD CONSTRAINT "FK_84c327d024fd89e6d221a067ea6" FOREIGN KEY ("bot_collection_id") REFERENCES "bot_collection"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bot_collection_user" DROP CONSTRAINT "FK_84c327d024fd89e6d221a067ea6"`);
        await queryRunner.query(`ALTER TABLE "process" DROP CONSTRAINT "FK_ab868b32a58c6512b68b9960bb8"`);
        await queryRunner.query(`ALTER TABLE "bot_collection" DROP CONSTRAINT "FK_259ea10c3617e2c3564d0ead503"`);
        await queryRunner.query(`ALTER TABLE "bot" DROP CONSTRAINT "FK_5f2d279e977d38b76d3f72c5463"`);
        await queryRunner.query(`ALTER TABLE "bot" DROP CONSTRAINT "FK_a3190460df612af6ab214b44a92"`);
        await queryRunner.query(`ALTER TABLE "bot" DROP CONSTRAINT "FK_52208d5c1c54f95568977094c62"`);
        await queryRunner.query(`ALTER TABLE "bot_collection" ALTER COLUMN "updated" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "bot_collection" ALTER COLUMN "created" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "bot_collection" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "bot_collection" ALTER COLUMN "id" SET DEFAULT uuid_in((md5(((random())|| (clock_timestamp())))))`);
        await queryRunner.query(`ALTER TABLE "bot_collection_user" ADD CONSTRAINT "FK_84c327d024fd89e6d221a067ea6" FOREIGN KEY ("bot_collection_id") REFERENCES "bot_collection"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "process" ADD CONSTRAINT "FK_ab868b32a58c6512b68b9960bb8" FOREIGN KEY ("bot_collection") REFERENCES "bot_collection"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bot" ALTER COLUMN "created" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "bot" DROP COLUMN "tenant_id"`);
        await queryRunner.query(`ALTER TABLE "bot_collection" ADD CONSTRAINT "fk_bot_collection_tenant_id" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bot_collection" ADD CONSTRAINT "fk_bot_collection_created_by" FOREIGN KEY ("created_by") REFERENCES "jhi_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bot" ADD CONSTRAINT "fk_bot_collection_id" FOREIGN KEY ("collection_id") REFERENCES "bot_collection"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bot" ADD CONSTRAINT "fk_bot_system" FOREIGN KEY ("system") REFERENCES "bot_system"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bot" ADD CONSTRAINT "fk_bot_user_id" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
