import { MigrationInterface, QueryRunner } from "typeorm";

export class SimplifyCredentialCollection1738051236121 implements MigrationInterface {
    name = 'SimplifyCredentialCollection1738051236121'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" DROP CONSTRAINT "PK_6031e489fe209c6475d5d375f57"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" ADD CONSTRAINT "PK_c1f6392fde3136c1b39d953bef5" PRIMARY KEY ("collection_id", "user_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" DROP CONSTRAINT "PK_c1f6392fde3136c1b39d953bef5"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" ADD CONSTRAINT "PK_6031e489fe209c6475d5d375f57" PRIMARY KEY ("id")`);
    }

}
