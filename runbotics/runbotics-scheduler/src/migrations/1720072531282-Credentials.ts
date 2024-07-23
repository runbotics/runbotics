import { MigrationInterface, QueryRunner } from "typeorm";

export class Credentials1720072531282 implements MigrationInterface {
    name = 'Credentials1720072531282'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "scheduler"."credential_template_attribute" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "required" boolean NOT NULL, "type" character varying NOT NULL, "template_id" uuid NOT NULL, CONSTRAINT "PK_fb9643ff7794611a6abe693c3be" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "scheduler"."credential_template" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "tenant_id" uuid, "description" character varying, "credentialsId" uuid, CONSTRAINT "UQ_8363f48a7697a4ee6e41f584b87" UNIQUE ("name"), CONSTRAINT "PK_94262abd8352fd19e4c500fff82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "scheduler"."credential" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "tenant_id" uuid NOT NULL, "description" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by_id" bigint NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" bigint NOT NULL, "template_id" uuid NOT NULL, CONSTRAINT "PK_3a5169bcd3d5463cefeec78be82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "scheduler"."attribute" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "tenant_id" uuid NOT NULL, "description" character varying, "masked" boolean NOT NULL, "type " character varying NOT NULL, "secret_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by_id" bigint NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" bigint NOT NULL, "credential_id" uuid NOT NULL, CONSTRAINT "REL_459bfa2dbfac0fc450f1866d0b" UNIQUE ("secret_id"), CONSTRAINT "PK_b13fb7c5c9e9dff62b60e0de729" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "scheduler"."credential_collection" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "tenant_id" uuid NOT NULL, "description" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by_id" bigint NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" bigint NOT NULL, CONSTRAINT "PK_8928d022104b6c32bc3923e12ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "jhi_authority_feature_keys_feature_key" ("authority" character varying(50) NOT NULL, "feature_key" character varying(50) NOT NULL, CONSTRAINT "PK_fd67870c3dc9a8edef27120f840" PRIMARY KEY ("authority", "feature_key"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b1a93afcebdf4ec98e96c8c6aa" ON "jhi_authority_feature_keys_feature_key" ("authority") `);
        await queryRunner.query(`CREATE INDEX "IDX_269490e1f3a032fbc02eb833a1" ON "jhi_authority_feature_keys_feature_key" ("feature_key") `);
        await queryRunner.query(`CREATE TABLE "scheduler"."credential_collection_user" ("collection_id" uuid NOT NULL, "user_id" bigint NOT NULL, CONSTRAINT "PK_c1f6392fde3136c1b39d953bef5" PRIMARY KEY ("collection_id", "user_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4d667ee9c8f087bbeaa5744fc0" ON "scheduler"."credential_collection_user" ("collection_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_14c0e239df3748b2a116b22ba9" ON "scheduler"."credential_collection_user" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_template_attribute" ADD CONSTRAINT "FK_c19a33d4662595010e94f69a85d" FOREIGN KEY ("template_id") REFERENCES "scheduler"."credential_template"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_template" ADD CONSTRAINT "FK_8858c92bf3c290efecd719b766e" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_template" ADD CONSTRAINT "FK_703ae6af6f58688622ebe122aa3" FOREIGN KEY ("credentialsId") REFERENCES "scheduler"."credential"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential" ADD CONSTRAINT "FK_67b2188c3549e8631110fc03bec" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential" ADD CONSTRAINT "FK_5f3dcfecb65a28b3657345507a2" FOREIGN KEY ("created_by_id") REFERENCES "jhi_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential" ADD CONSTRAINT "FK_c7f06ea7b501efdd1a442d7f7e6" FOREIGN KEY ("updated_by_id") REFERENCES "jhi_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential" ADD CONSTRAINT "FK_94262abd8352fd19e4c500fff82" FOREIGN KEY ("template_id") REFERENCES "scheduler"."credential_template"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."attribute" ADD CONSTRAINT "FK_53e11054a6e395e8adf1e1c97f6" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."attribute" ADD CONSTRAINT "FK_459bfa2dbfac0fc450f1866d0b4" FOREIGN KEY ("secret_id") REFERENCES "scheduler"."secret"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."attribute" ADD CONSTRAINT "FK_227839f8565d4424b6b02862fca" FOREIGN KEY ("created_by_id") REFERENCES "jhi_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."attribute" ADD CONSTRAINT "FK_3b4e96a3d1483e357a58cba5cb4" FOREIGN KEY ("updated_by_id") REFERENCES "jhi_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."attribute" ADD CONSTRAINT "FK_5645ccd9d2c5c129ee9bb49ae8b" FOREIGN KEY ("credential_id") REFERENCES "scheduler"."credential"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection" ADD CONSTRAINT "FK_3bd890535d007ae922b8a8d57fb" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection" ADD CONSTRAINT "FK_904fa54de57a33b4bedeb54ff9e" FOREIGN KEY ("created_by_id") REFERENCES "jhi_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection" ADD CONSTRAINT "FK_bdd0d73c04229928006483fd445" FOREIGN KEY ("updated_by_id") REFERENCES "jhi_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "jhi_authority_feature_keys_feature_key" ADD CONSTRAINT "FK_b1a93afcebdf4ec98e96c8c6aac" FOREIGN KEY ("authority") REFERENCES "jhi_authority"("name") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "jhi_authority_feature_keys_feature_key" ADD CONSTRAINT "FK_269490e1f3a032fbc02eb833a12" FOREIGN KEY ("feature_key") REFERENCES "feature_key"("name") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" ADD CONSTRAINT "FK_4d667ee9c8f087bbeaa5744fc00" FOREIGN KEY ("collection_id") REFERENCES "scheduler"."credential_collection"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" ADD CONSTRAINT "FK_14c0e239df3748b2a116b22ba9b" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" DROP CONSTRAINT "FK_14c0e239df3748b2a116b22ba9b"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" DROP CONSTRAINT "FK_4d667ee9c8f087bbeaa5744fc00"`);
        await queryRunner.query(`ALTER TABLE "jhi_authority_feature_keys_feature_key" DROP CONSTRAINT "FK_269490e1f3a032fbc02eb833a12"`);
        await queryRunner.query(`ALTER TABLE "jhi_authority_feature_keys_feature_key" DROP CONSTRAINT "FK_b1a93afcebdf4ec98e96c8c6aac"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection" DROP CONSTRAINT "FK_bdd0d73c04229928006483fd445"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection" DROP CONSTRAINT "FK_904fa54de57a33b4bedeb54ff9e"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection" DROP CONSTRAINT "FK_3bd890535d007ae922b8a8d57fb"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."attribute" DROP CONSTRAINT "FK_5645ccd9d2c5c129ee9bb49ae8b"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."attribute" DROP CONSTRAINT "FK_3b4e96a3d1483e357a58cba5cb4"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."attribute" DROP CONSTRAINT "FK_227839f8565d4424b6b02862fca"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."attribute" DROP CONSTRAINT "FK_459bfa2dbfac0fc450f1866d0b4"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."attribute" DROP CONSTRAINT "FK_53e11054a6e395e8adf1e1c97f6"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential" DROP CONSTRAINT "FK_94262abd8352fd19e4c500fff82"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential" DROP CONSTRAINT "FK_c7f06ea7b501efdd1a442d7f7e6"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential" DROP CONSTRAINT "FK_5f3dcfecb65a28b3657345507a2"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential" DROP CONSTRAINT "FK_67b2188c3549e8631110fc03bec"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_template" DROP CONSTRAINT "FK_703ae6af6f58688622ebe122aa3"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_template" DROP CONSTRAINT "FK_8858c92bf3c290efecd719b766e"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_template_attribute" DROP CONSTRAINT "FK_c19a33d4662595010e94f69a85d"`);
        await queryRunner.query(`DROP INDEX "scheduler"."IDX_14c0e239df3748b2a116b22ba9"`);
        await queryRunner.query(`DROP INDEX "scheduler"."IDX_4d667ee9c8f087bbeaa5744fc0"`);
        await queryRunner.query(`DROP TABLE "scheduler"."credential_collection_user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_269490e1f3a032fbc02eb833a1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b1a93afcebdf4ec98e96c8c6aa"`);
        await queryRunner.query(`DROP TABLE "jhi_authority_feature_keys_feature_key"`);
        await queryRunner.query(`DROP TABLE "scheduler"."credential_collection"`);
        await queryRunner.query(`DROP TABLE "scheduler"."attribute"`);
        await queryRunner.query(`DROP TABLE "scheduler"."credential"`);
        await queryRunner.query(`DROP TABLE "scheduler"."credential_template"`);
        await queryRunner.query(`DROP TABLE "scheduler"."credential_template_attribute"`);
    }

}
