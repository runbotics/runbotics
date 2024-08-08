import { MigrationInterface, QueryRunner } from "typeorm";

export class Credentials1723100555435 implements MigrationInterface {
    name = 'Credentials1723100555435'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "scheduler"."credential_template_attribute" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "template_id" uuid NOT NULL, CONSTRAINT "UQ_1b70895f87cfcec88f2e9b2a0c4" UNIQUE ("name", "template_id"), CONSTRAINT "PK_fb9643ff7794611a6abe693c3be" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "scheduler"."credential_template" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, CONSTRAINT "UQ_8363f48a7697a4ee6e41f584b87" UNIQUE ("name"), CONSTRAINT "PK_94262abd8352fd19e4c500fff82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "scheduler"."credential_collection_user_privilege_type_enum" AS ENUM('READ', 'WRITE')`);
        await queryRunner.query(`CREATE TABLE "scheduler"."credential_collection_user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "collection_id" uuid NOT NULL, "user_id" bigint NOT NULL, "privilege_type" "scheduler"."credential_collection_user_privilege_type_enum" NOT NULL DEFAULT 'WRITE', CONSTRAINT "PK_6031e489fe209c6475d5d375f57" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "scheduler"."credential_collection_access_type_enum" AS ENUM('PRIVATE', 'GROUP')`);
        await queryRunner.query(`CREATE TYPE "scheduler"."credential_collection_color_enum" AS ENUM('LIGHT_ORANGE', 'DARK_ORANGE', 'LIGHT_GREEN', 'DARK_GREEN', 'LIGHT_BLUE', 'DARK_BLUE', 'LIGHT_GREY', 'DARK_GREY')`);
        await queryRunner.query(`CREATE TABLE "scheduler"."credential_collection" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "tenant_id" uuid NOT NULL, "description" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by_id" bigint NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" bigint NOT NULL, "access_type" "scheduler"."credential_collection_access_type_enum" NOT NULL DEFAULT 'PRIVATE', "color" "scheduler"."credential_collection_color_enum" NOT NULL DEFAULT 'LIGHT_ORANGE', CONSTRAINT "UQ_c712ddc22fb9bcd2c85d1579af5" UNIQUE ("name", "tenant_id", "created_by_id"), CONSTRAINT "PK_8928d022104b6c32bc3923e12ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "scheduler"."credential" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "tenant_id" uuid NOT NULL, "description" character varying, "collection_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by_id" bigint NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" bigint NOT NULL, "template_id" uuid NOT NULL, CONSTRAINT "UQ_afc42c6ae4fa2eaf78ef7ad0145" UNIQUE ("collection_id", "name", "tenant_id"), CONSTRAINT "PK_3a5169bcd3d5463cefeec78be82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "scheduler"."credential_attribute" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "tenant_id" uuid NOT NULL, "description" character varying, "masked" boolean NOT NULL, "secret_id" uuid NOT NULL, "credential_id" uuid NOT NULL, CONSTRAINT "UQ_0040a5c98f673bbdb4ef8f35a87" UNIQUE ("name", "credential_id"), CONSTRAINT "REL_10dfcac0476d35e610b4ef31fa" UNIQUE ("secret_id"), CONSTRAINT "PK_1751f2a8037133943ca06ac21e4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_template_attribute" ADD CONSTRAINT "FK_c19a33d4662595010e94f69a85d" FOREIGN KEY ("template_id") REFERENCES "scheduler"."credential_template"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" ADD CONSTRAINT "FK_4d667ee9c8f087bbeaa5744fc00" FOREIGN KEY ("collection_id") REFERENCES "scheduler"."credential_collection"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" ADD CONSTRAINT "FK_14c0e239df3748b2a116b22ba9b" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection" ADD CONSTRAINT "FK_3bd890535d007ae922b8a8d57fb" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection" ADD CONSTRAINT "FK_904fa54de57a33b4bedeb54ff9e" FOREIGN KEY ("created_by_id") REFERENCES "jhi_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection" ADD CONSTRAINT "FK_bdd0d73c04229928006483fd445" FOREIGN KEY ("updated_by_id") REFERENCES "jhi_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential" ADD CONSTRAINT "FK_67b2188c3549e8631110fc03bec" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential" ADD CONSTRAINT "FK_8928d022104b6c32bc3923e12ea" FOREIGN KEY ("collection_id") REFERENCES "scheduler"."credential_collection"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential" ADD CONSTRAINT "FK_5f3dcfecb65a28b3657345507a2" FOREIGN KEY ("created_by_id") REFERENCES "jhi_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential" ADD CONSTRAINT "FK_c7f06ea7b501efdd1a442d7f7e6" FOREIGN KEY ("updated_by_id") REFERENCES "jhi_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential" ADD CONSTRAINT "FK_94262abd8352fd19e4c500fff82" FOREIGN KEY ("template_id") REFERENCES "scheduler"."credential_template"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_attribute" ADD CONSTRAINT "FK_1a441188b5c83ce83ec267761e0" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_attribute" ADD CONSTRAINT "FK_10dfcac0476d35e610b4ef31faa" FOREIGN KEY ("secret_id") REFERENCES "scheduler"."secret"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_attribute" ADD CONSTRAINT "FK_c70d5eab619f137e2053e371456" FOREIGN KEY ("credential_id") REFERENCES "scheduler"."credential"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_attribute" DROP CONSTRAINT "FK_c70d5eab619f137e2053e371456"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_attribute" DROP CONSTRAINT "FK_10dfcac0476d35e610b4ef31faa"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_attribute" DROP CONSTRAINT "FK_1a441188b5c83ce83ec267761e0"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential" DROP CONSTRAINT "FK_94262abd8352fd19e4c500fff82"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential" DROP CONSTRAINT "FK_c7f06ea7b501efdd1a442d7f7e6"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential" DROP CONSTRAINT "FK_5f3dcfecb65a28b3657345507a2"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential" DROP CONSTRAINT "FK_8928d022104b6c32bc3923e12ea"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential" DROP CONSTRAINT "FK_67b2188c3549e8631110fc03bec"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection" DROP CONSTRAINT "FK_bdd0d73c04229928006483fd445"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection" DROP CONSTRAINT "FK_904fa54de57a33b4bedeb54ff9e"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection" DROP CONSTRAINT "FK_3bd890535d007ae922b8a8d57fb"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" DROP CONSTRAINT "FK_14c0e239df3748b2a116b22ba9b"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" DROP CONSTRAINT "FK_4d667ee9c8f087bbeaa5744fc00"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_template_attribute" DROP CONSTRAINT "FK_c19a33d4662595010e94f69a85d"`);
        await queryRunner.query(`DROP TABLE "scheduler"."credential_attribute"`);
        await queryRunner.query(`DROP TABLE "scheduler"."credential"`);
        await queryRunner.query(`DROP TABLE "scheduler"."credential_collection"`);
        await queryRunner.query(`DROP TYPE "scheduler"."credential_collection_color_enum"`);
        await queryRunner.query(`DROP TYPE "scheduler"."credential_collection_access_type_enum"`);
        await queryRunner.query(`DROP TABLE "scheduler"."credential_collection_user"`);
        await queryRunner.query(`DROP TYPE "scheduler"."credential_collection_user_privilege_type_enum"`);
        await queryRunner.query(`DROP TABLE "scheduler"."credential_template"`);
        await queryRunner.query(`DROP TABLE "scheduler"."credential_template_attribute"`);
    }

}
