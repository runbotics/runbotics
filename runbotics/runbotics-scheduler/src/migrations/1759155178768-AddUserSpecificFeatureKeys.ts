import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserSpecificFeatureKeys1759155178768 implements MigrationInterface {
    name = 'AddUserSpecificFeatureKeys1759155178768';

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query('CREATE TABLE "user_feature_key" ("user_id" bigint NOT NULL, "feature_key" character varying(50) NOT NULL, CONSTRAINT "PK_70fd9aae730ee19433fc28b8df7" PRIMARY KEY ("user_id", "feature_key"))');
        await queryRunner.query('CREATE INDEX "IDX_5cf5b9dbc9464e910fca9d8d51" ON "user_feature_key" ("user_id") ');
        await queryRunner.query('CREATE INDEX "IDX_e33ce8759a62de0bf99a700cc0" ON "user_feature_key" ("feature_key") ');
        await queryRunner.query('ALTER TABLE "user_feature_key" ADD CONSTRAINT "FK_5cf5b9dbc9464e910fca9d8d519" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE CASCADE ON UPDATE CASCADE');
        await queryRunner.query('ALTER TABLE "user_feature_key" ADD CONSTRAINT "FK_e33ce8759a62de0bf99a700cc08" FOREIGN KEY ("feature_key") REFERENCES "feature_key"("name") ON DELETE CASCADE ON UPDATE CASCADE');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "user_feature_key" DROP CONSTRAINT "FK_e33ce8759a62de0bf99a700cc08"');
        await queryRunner.query('ALTER TABLE "user_feature_key" DROP CONSTRAINT "FK_5cf5b9dbc9464e910fca9d8d519"');
        await queryRunner.query('DROP INDEX "public"."IDX_e33ce8759a62de0bf99a700cc0"');
        await queryRunner.query('DROP INDEX "public"."IDX_5cf5b9dbc9464e910fca9d8d51"');
        await queryRunner.query('DROP TABLE "user_feature_key"');
    }

}
