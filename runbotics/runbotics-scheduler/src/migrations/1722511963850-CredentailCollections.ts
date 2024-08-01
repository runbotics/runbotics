import { MigrationInterface, QueryRunner } from "typeorm";

export class CredentailCollections1722511963850 implements MigrationInterface {
    name = 'CredentailCollections1722511963850'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" DROP CONSTRAINT "FK_14c0e239df3748b2a116b22ba9b"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" DROP CONSTRAINT "FK_4d667ee9c8f087bbeaa5744fc00"`);
        await queryRunner.query(`DROP INDEX "scheduler"."IDX_4d667ee9c8f087bbeaa5744fc0"`);
        await queryRunner.query(`DROP INDEX "scheduler"."IDX_14c0e239df3748b2a116b22ba9"`);
        await queryRunner.query(`CREATE TABLE "jhi_authority_feature_keys_feature_key" ("authority" character varying(50) NOT NULL, "feature_key" character varying(50) NOT NULL, CONSTRAINT "PK_fd67870c3dc9a8edef27120f840" PRIMARY KEY ("authority", "feature_key"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b1a93afcebdf4ec98e96c8c6aa" ON "jhi_authority_feature_keys_feature_key" ("authority") `);
        await queryRunner.query(`CREATE INDEX "IDX_269490e1f3a032fbc02eb833a1" ON "jhi_authority_feature_keys_feature_key" ("feature_key") `);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" DROP CONSTRAINT "PK_c1f6392fde3136c1b39d953bef5"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" ADD CONSTRAINT "PK_b410cc77fbb04aa23e7f5bab5f4" PRIMARY KEY ("collection_id", "user_id", "id")`);
        await queryRunner.query(`CREATE TYPE "scheduler"."credential_collection_user_privilegetype_enum" AS ENUM('READ', 'WRITE')`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" ADD "privilegeType" "scheduler"."credential_collection_user_privilegetype_enum" NOT NULL DEFAULT 'WRITE'`);
        await queryRunner.query(`CREATE TYPE "scheduler"."credential_collection_accesstype_enum" AS ENUM('PRIVATE', 'GROUP')`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection" ADD "accessType" "scheduler"."credential_collection_accesstype_enum" NOT NULL DEFAULT 'PRIVATE'`);
        await queryRunner.query(`CREATE TYPE "scheduler"."credential_collection_color_enum" AS ENUM('ORANGE', 'YELLOW', 'BLUE', 'GREEN', 'RED')`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection" ADD "color" "scheduler"."credential_collection_color_enum" NOT NULL DEFAULT 'ORANGE'`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential" ADD "collection_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" DROP CONSTRAINT "PK_b410cc77fbb04aa23e7f5bab5f4"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" ADD CONSTRAINT "PK_3d8673bb4e940f006bbdf3ef8da" PRIMARY KEY ("user_id", "id")`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" DROP CONSTRAINT "PK_3d8673bb4e940f006bbdf3ef8da"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" ADD CONSTRAINT "PK_6031e489fe209c6475d5d375f57" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection" DROP COLUMN "created_by_id"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection" ADD "created_by_id" bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection" ADD CONSTRAINT "UQ_904fa54de57a33b4bedeb54ff9e" UNIQUE ("created_by_id")`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection" DROP COLUMN "updated_by_id"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection" ADD "updated_by_id" bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection" ADD CONSTRAINT "UQ_bdd0d73c04229928006483fd445" UNIQUE ("updated_by_id")`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" ADD CONSTRAINT "FK_4d667ee9c8f087bbeaa5744fc00" FOREIGN KEY ("collection_id") REFERENCES "scheduler"."credential_collection"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" ADD CONSTRAINT "FK_14c0e239df3748b2a116b22ba9b" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection" ADD CONSTRAINT "FK_904fa54de57a33b4bedeb54ff9e" FOREIGN KEY ("created_by_id") REFERENCES "jhi_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection" ADD CONSTRAINT "FK_bdd0d73c04229928006483fd445" FOREIGN KEY ("updated_by_id") REFERENCES "jhi_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential" ADD CONSTRAINT "FK_8928d022104b6c32bc3923e12ea" FOREIGN KEY ("collection_id") REFERENCES "scheduler"."credential_collection"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "jhi_authority_feature_keys_feature_key" ADD CONSTRAINT "FK_b1a93afcebdf4ec98e96c8c6aac" FOREIGN KEY ("authority") REFERENCES "jhi_authority"("name") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "jhi_authority_feature_keys_feature_key" ADD CONSTRAINT "FK_269490e1f3a032fbc02eb833a12" FOREIGN KEY ("feature_key") REFERENCES "feature_key"("name") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "jhi_authority_feature_keys_feature_key" DROP CONSTRAINT "FK_269490e1f3a032fbc02eb833a12"`);
        await queryRunner.query(`ALTER TABLE "jhi_authority_feature_keys_feature_key" DROP CONSTRAINT "FK_b1a93afcebdf4ec98e96c8c6aac"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential" DROP CONSTRAINT "FK_8928d022104b6c32bc3923e12ea"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection" DROP CONSTRAINT "FK_bdd0d73c04229928006483fd445"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection" DROP CONSTRAINT "FK_904fa54de57a33b4bedeb54ff9e"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" DROP CONSTRAINT "FK_14c0e239df3748b2a116b22ba9b"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" DROP CONSTRAINT "FK_4d667ee9c8f087bbeaa5744fc00"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection" DROP CONSTRAINT "UQ_bdd0d73c04229928006483fd445"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection" DROP COLUMN "updated_by_id"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection" ADD "updated_by_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection" DROP CONSTRAINT "UQ_904fa54de57a33b4bedeb54ff9e"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection" DROP COLUMN "created_by_id"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection" ADD "created_by_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" DROP CONSTRAINT "PK_6031e489fe209c6475d5d375f57"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" ADD CONSTRAINT "PK_3d8673bb4e940f006bbdf3ef8da" PRIMARY KEY ("user_id", "id")`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" DROP CONSTRAINT "PK_3d8673bb4e940f006bbdf3ef8da"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" ADD CONSTRAINT "PK_b410cc77fbb04aa23e7f5bab5f4" PRIMARY KEY ("collection_id", "user_id", "id")`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential" DROP COLUMN "collection_id"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection" DROP COLUMN "color"`);
        await queryRunner.query(`DROP TYPE "scheduler"."credential_collection_color_enum"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection" DROP COLUMN "accessType"`);
        await queryRunner.query(`DROP TYPE "scheduler"."credential_collection_accesstype_enum"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" DROP COLUMN "privilegeType"`);
        await queryRunner.query(`DROP TYPE "scheduler"."credential_collection_user_privilegetype_enum"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" DROP CONSTRAINT "PK_b410cc77fbb04aa23e7f5bab5f4"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" ADD CONSTRAINT "PK_c1f6392fde3136c1b39d953bef5" PRIMARY KEY ("collection_id", "user_id")`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" DROP COLUMN "id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_269490e1f3a032fbc02eb833a1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b1a93afcebdf4ec98e96c8c6aa"`);
        await queryRunner.query(`DROP TABLE "jhi_authority_feature_keys_feature_key"`);
        await queryRunner.query(`CREATE INDEX "IDX_14c0e239df3748b2a116b22ba9" ON "scheduler"."credential_collection_user" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_4d667ee9c8f087bbeaa5744fc0" ON "scheduler"."credential_collection_user" ("collection_id") `);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" ADD CONSTRAINT "FK_4d667ee9c8f087bbeaa5744fc00" FOREIGN KEY ("collection_id") REFERENCES "scheduler"."credential_collection"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" ADD CONSTRAINT "FK_14c0e239df3748b2a116b22ba9b" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
