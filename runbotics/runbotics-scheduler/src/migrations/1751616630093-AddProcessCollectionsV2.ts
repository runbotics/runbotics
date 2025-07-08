import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProcessCollectionsV21751616630093 implements MigrationInterface {
    name = 'AddProcessCollectionsV21751616630093';

    public async up(queryRunner: QueryRunner): Promise<void> {
        //Custom Query to add enum bcs of typeorm problems with enums where are the same values
        await queryRunner.query(`DO $$
      BEGIN
          IF NOT EXISTS (
              SELECT 1 FROM pg_type t
              JOIN pg_namespace n ON n.oid = t.typnamespace
              WHERE t.typname = 'process_collection_user_privilege_type_enum' AND n.nspname = 'scheduler'
          ) THEN
              CREATE TYPE "scheduler".process_collection_user_privilege_type_enum AS ENUM ('READ', 'WRITE');
          END IF;
      END
      $$;`);
        await queryRunner.query(`CREATE TABLE "scheduler"."process_collection_user"
                                 (
                                     "id"                  BIGSERIAL                                                 NOT NULL,
                                     "privilege_type"      "scheduler"."process_collection_user_privilege_type_enum" NOT NULL,
                                     "userId"              bigint                                                    NOT NULL,
                                     "processCollectionId" uuid                                                      NOT NULL,
                                     CONSTRAINT "PK_d6ecb0ffb078aba9fa244571e5f" PRIMARY KEY ("id")
                                 )`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_70171c106cd353d616c3770872" ON "scheduler"."process_collection_user" ("userId", "processCollectionId") `);
        await queryRunner.query(`CREATE TABLE "scheduler"."process_collection_link"
                                 (
                                     "id"           uuid      NOT NULL DEFAULT uuid_generate_v4(),
                                     "collectionId" uuid      NOT NULL,
                                     "token"        uuid      NOT NULL DEFAULT uuid_generate_v4(),
                                     "userId"       bigint    NOT NULL,
                                     "createdAt"    TIMESTAMP NOT NULL DEFAULT now(),
                                     CONSTRAINT "PK_f7253b56fcc26ae4a6dddcc231c" PRIMARY KEY ("id", "collectionId")
                                 )`);
        await queryRunner.query(`CREATE TABLE "scheduler"."process_collection"
                                 (
                                     "id"          uuid              NOT NULL DEFAULT uuid_generate_v4(),
                                     "name"        character varying NOT NULL,
                                     "description" character varying,
                                     "created"     TIMESTAMP         NOT NULL DEFAULT now(),
                                     "updated"     TIMESTAMP         NOT NULL DEFAULT now(),
                                     "created_by"  bigint,
                                     "owner_id"    bigint,
                                     "isPublic"    boolean           NOT NULL DEFAULT false,
                                     "tenant_id"   uuid              NOT NULL DEFAULT 'b7f9092f-5973-c781-08db-4d6e48f78e98',
                                     "parentId"    uuid,
                                     CONSTRAINT "PK_5ab708364452e949d056e7733f9" PRIMARY KEY ("id")
                                 )`);
        await queryRunner.query(`CREATE TABLE "process_collection_closure"
                                 (
                                     "id_ancestor"   uuid NOT NULL,
                                     "id_descendant" uuid NOT NULL,
                                     CONSTRAINT "PK_67d25e7cf15b667b98b09ea6b2d" PRIMARY KEY ("id_ancestor", "id_descendant")
                                 )`);
        await queryRunner.query(`CREATE INDEX "IDX_39a04cb04cc82cbd0929d87136" ON "process_collection_closure" ("id_ancestor") `);
        await queryRunner.query(`CREATE INDEX "IDX_6f9ac9d1123599ef4bcdeaf93c" ON "process_collection_closure" ("id_descendant") `);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_collection_user"
            ADD CONSTRAINT "FK_b2302992f3479a88883f9722911" FOREIGN KEY ("userId") REFERENCES "jhi_user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_collection_user"
            ADD CONSTRAINT "FK_cfd3f641b39f83d663bb2eb862b" FOREIGN KEY ("processCollectionId") REFERENCES "scheduler"."process_collection" ("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_collection_link"
            ADD CONSTRAINT "FK_bd7140ad52076f2ad80197f64d5" FOREIGN KEY ("collectionId") REFERENCES "scheduler"."process_collection" ("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_collection_link"
            ADD CONSTRAINT "FK_cd13e2edf72ecc274d7d1493e4f" FOREIGN KEY ("userId") REFERENCES "jhi_user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_collection"
            ADD CONSTRAINT "FK_8e9bec83e0f75715c43950ce006" FOREIGN KEY ("created_by") REFERENCES "jhi_user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_collection"
            ADD CONSTRAINT "FK_d61c2bd1ddad8d203bcd951ddf0" FOREIGN KEY ("owner_id") REFERENCES "jhi_user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_collection"
            ADD CONSTRAINT "FK_de0aba3344d22a98f3a3820081f" FOREIGN KEY ("tenant_id") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_collection"
            ADD CONSTRAINT "FK_eb5ddd558ef8d39a49bf5a8cc45" FOREIGN KEY ("parentId") REFERENCES "scheduler"."process_collection" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process_collection_closure"
            ADD CONSTRAINT "FK_39a04cb04cc82cbd0929d871360" FOREIGN KEY ("id_ancestor") REFERENCES "scheduler"."process_collection" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process_collection_closure"
            ADD CONSTRAINT "FK_6f9ac9d1123599ef4bcdeaf93c4" FOREIGN KEY ("id_descendant") REFERENCES "scheduler"."process_collection" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);

        const insertResult = await queryRunner.query(`
            INSERT INTO scheduler.process_collection (name, description)
            VALUES ($1, $2)
            RETURNING id
        `, ['ROOT', 'ROOT']);
        const insertedId = insertResult[0].id;
        await queryRunner.query(`
            INSERT INTO public.process_collection_closure (id_ancestor, id_descendant)
            VALUES ($1, $1)
        `, [insertedId]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "process_collection_closure"
            DROP CONSTRAINT "FK_6f9ac9d1123599ef4bcdeaf93c4"`);
        await queryRunner.query(`ALTER TABLE "process_collection_closure"
            DROP CONSTRAINT "FK_39a04cb04cc82cbd0929d871360"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_collection"
            DROP CONSTRAINT "FK_eb5ddd558ef8d39a49bf5a8cc45"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_collection"
            DROP CONSTRAINT "FK_de0aba3344d22a98f3a3820081f"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_collection"
            DROP CONSTRAINT "FK_d61c2bd1ddad8d203bcd951ddf0"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_collection"
            DROP CONSTRAINT "FK_8e9bec83e0f75715c43950ce006"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_collection_link"
            DROP CONSTRAINT "FK_cd13e2edf72ecc274d7d1493e4f"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_collection_link"
            DROP CONSTRAINT "FK_bd7140ad52076f2ad80197f64d5"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_collection_user"
            DROP CONSTRAINT "FK_cfd3f641b39f83d663bb2eb862b"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."process_collection_user"
            DROP CONSTRAINT "FK_b2302992f3479a88883f9722911"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6f9ac9d1123599ef4bcdeaf93c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_39a04cb04cc82cbd0929d87136"`);
        await queryRunner.query(`DROP TABLE "process_collection_closure"`);
        await queryRunner.query(`DROP TABLE "scheduler"."process_collection"`);
        await queryRunner.query(`DROP TABLE "scheduler"."process_collection_link"`);
        await queryRunner.query(`DROP INDEX "scheduler"."IDX_70171c106cd353d616c3770872"`);
        await queryRunner.query(`DROP TABLE "scheduler"."process_collection_user"`);
        await queryRunner.query(`DROP TYPE "scheduler"."process_collection_user_privilege_type_enum"`);
    }

}
