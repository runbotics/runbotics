import { MigrationInterface, QueryRunner } from "typeorm";

export class Credential1719407337310 implements MigrationInterface {
    name = 'Credential1719407337310'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "scheduler"."credential_collection" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "tenant_id" uuid NOT NULL, "description" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by_id" bigint NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by_id" bigint NOT NULL, CONSTRAINT "PK_8928d022104b6c32bc3923e12ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "scheduler"."credential_collection_user" ("collection_id" uuid NOT NULL, "user_id" bigint NOT NULL, CONSTRAINT "PK_c1f6392fde3136c1b39d953bef5" PRIMARY KEY ("collection_id", "user_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4d667ee9c8f087bbeaa5744fc0" ON "scheduler"."credential_collection_user" ("collection_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_14c0e239df3748b2a116b22ba9" ON "scheduler"."credential_collection_user" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential" ADD "collection_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection" ADD CONSTRAINT "FK_3bd890535d007ae922b8a8d57fb" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection" ADD CONSTRAINT "FK_904fa54de57a33b4bedeb54ff9e" FOREIGN KEY ("created_by_id") REFERENCES "jhi_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection" ADD CONSTRAINT "FK_bdd0d73c04229928006483fd445" FOREIGN KEY ("updated_by_id") REFERENCES "jhi_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential" ADD CONSTRAINT "FK_8928d022104b6c32bc3923e12ea" FOREIGN KEY ("collection_id") REFERENCES "scheduler"."credential_collection"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" ADD CONSTRAINT "FK_4d667ee9c8f087bbeaa5744fc00" FOREIGN KEY ("collection_id") REFERENCES "scheduler"."credential_collection"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" ADD CONSTRAINT "FK_14c0e239df3748b2a116b22ba9b" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" DROP CONSTRAINT "FK_14c0e239df3748b2a116b22ba9b"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" DROP CONSTRAINT "FK_4d667ee9c8f087bbeaa5744fc00"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential" DROP CONSTRAINT "FK_8928d022104b6c32bc3923e12ea"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection" DROP CONSTRAINT "FK_bdd0d73c04229928006483fd445"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection" DROP CONSTRAINT "FK_904fa54de57a33b4bedeb54ff9e"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection" DROP CONSTRAINT "FK_3bd890535d007ae922b8a8d57fb"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential" DROP COLUMN "collection_id"`);
        await queryRunner.query(`DROP INDEX "scheduler"."IDX_14c0e239df3748b2a116b22ba9"`);
        await queryRunner.query(`DROP INDEX "scheduler"."IDX_4d667ee9c8f087bbeaa5744fc0"`);
        await queryRunner.query(`DROP TABLE "scheduler"."credential_collection_user"`);
        await queryRunner.query(`DROP TABLE "scheduler"."credential_collection"`);
    }

}
