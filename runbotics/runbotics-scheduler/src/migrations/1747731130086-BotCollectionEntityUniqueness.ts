import { MigrationInterface, QueryRunner } from "typeorm";

export class BotCollectionEntityUniqueness1747731130086 implements MigrationInterface {
    name = 'BotCollectionEntityUniqueness1747731130086'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bot_collection" DROP CONSTRAINT "bot_collection_name_key"`);
        await queryRunner.query(`ALTER TABLE "bot_collection" ADD CONSTRAINT "UQ_f4d6fcc2474fa0637d50d7cd310" UNIQUE ("name", "tenant_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bot_collection" DROP CONSTRAINT "UQ_f4d6fcc2474fa0637d50d7cd310"`);
        await queryRunner.query(`ALTER TABLE "bot_collection" ADD CONSTRAINT "bot_collection_name_key" UNIQUE ("name")`);
    }

}
