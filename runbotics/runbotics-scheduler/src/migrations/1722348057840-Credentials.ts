import { MigrationInterface, QueryRunner } from "typeorm";

export class Credentials1722348057840 implements MigrationInterface {
    name = 'Credentials1722348057840'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "scheduler"."credential_template_attribute" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "template_id" uuid NOT NULL, CONSTRAINT "UQ_1b70895f87cfcec88f2e9b2a0c4" UNIQUE ("name", "template_id"), CONSTRAINT "PK_fb9643ff7794611a6abe693c3be" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "scheduler"."credential_template" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "tenant_id" uuid, "description" character varying, "credentialsId" uuid, CONSTRAINT "UQ_8363f48a7697a4ee6e41f584b87" UNIQUE ("name"), CONSTRAINT "PK_94262abd8352fd19e4c500fff82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "scheduler"."credential" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "tenant_id" uuid NOT NULL, "description" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by_id" bigint NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" bigint NOT NULL, "template_id" uuid NOT NULL, CONSTRAINT "UQ_3692db2ddec974af28dec42f77a" UNIQUE ("created_by_id", "name"), CONSTRAINT "PK_3a5169bcd3d5463cefeec78be82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "scheduler"."credential_attribute" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "tenant_id" uuid NOT NULL, "description" character varying, "masked" boolean NOT NULL, "type" character varying NOT NULL, "secret_id" uuid NOT NULL, "credential_id" uuid NOT NULL, CONSTRAINT "UQ_0040a5c98f673bbdb4ef8f35a87" UNIQUE ("name", "credential_id"), CONSTRAINT "REL_10dfcac0476d35e610b4ef31fa" UNIQUE ("secret_id"), CONSTRAINT "PK_1751f2a8037133943ca06ac21e4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "scheduler"."credential_collection" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "tenant_id" uuid NOT NULL, "description" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by_id" integer NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" integer NOT NULL, CONSTRAINT "PK_8928d022104b6c32bc3923e12ea" PRIMARY KEY ("id"))`);
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
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_attribute" ADD CONSTRAINT "FK_1a441188b5c83ce83ec267761e0" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_attribute" ADD CONSTRAINT "FK_10dfcac0476d35e610b4ef31faa" FOREIGN KEY ("secret_id") REFERENCES "scheduler"."secret"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_attribute" ADD CONSTRAINT "FK_c70d5eab619f137e2053e371456" FOREIGN KEY ("credential_id") REFERENCES "scheduler"."credential"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection" ADD CONSTRAINT "FK_3bd890535d007ae922b8a8d57fb" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" ADD CONSTRAINT "FK_4d667ee9c8f087bbeaa5744fc00" FOREIGN KEY ("collection_id") REFERENCES "scheduler"."credential_collection"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" ADD CONSTRAINT "FK_14c0e239df3748b2a116b22ba9b" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" DROP CONSTRAINT "FK_14c0e239df3748b2a116b22ba9b"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" DROP CONSTRAINT "FK_4d667ee9c8f087bbeaa5744fc00"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection" DROP CONSTRAINT "FK_3bd890535d007ae922b8a8d57fb"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_attribute" DROP CONSTRAINT "FK_c70d5eab619f137e2053e371456"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_attribute" DROP CONSTRAINT "FK_10dfcac0476d35e610b4ef31faa"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_attribute" DROP CONSTRAINT "FK_1a441188b5c83ce83ec267761e0"`);
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
        await queryRunner.query(`DROP TABLE "scheduler"."credential_collection"`);
        await queryRunner.query(`DROP TABLE "scheduler"."credential_attribute"`);
        await queryRunner.query(`DROP TABLE "scheduler"."credential"`);
        await queryRunner.query(`DROP TABLE "scheduler"."credential_template"`);
        await queryRunner.query(`DROP TABLE "scheduler"."credential_template_attribute"`);
    }

}
