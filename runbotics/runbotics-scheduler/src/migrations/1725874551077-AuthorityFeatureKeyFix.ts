import { MigrationInterface, QueryRunner } from "typeorm";

export class AuthorityFeatureKeyFix1725874551077 implements MigrationInterface {
    name = 'AuthorityFeatureKeyFix1725874551077'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "authority_feature_key" DROP CONSTRAINT "FK_ee32be0d48bb43e55e430862cad"`);
        await queryRunner.query(`ALTER TABLE "authority_feature_key" DROP CONSTRAINT "FK_d16bcd920bc96d726d179b6cceb"`);
        await queryRunner.query(`CREATE INDEX "IDX_ee32be0d48bb43e55e430862ca" ON "authority_feature_key" ("authority") `);
        await queryRunner.query(`CREATE INDEX "IDX_d16bcd920bc96d726d179b6cce" ON "authority_feature_key" ("feature_key") `);
        await queryRunner.query(`ALTER TABLE "authority_feature_key" ADD CONSTRAINT "FK_ee32be0d48bb43e55e430862cad" FOREIGN KEY ("authority") REFERENCES "jhi_authority"("name") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "authority_feature_key" ADD CONSTRAINT "FK_d16bcd920bc96d726d179b6cceb" FOREIGN KEY ("feature_key") REFERENCES "feature_key"("name") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "authority_feature_key" DROP CONSTRAINT "FK_d16bcd920bc96d726d179b6cceb"`);
        await queryRunner.query(`ALTER TABLE "authority_feature_key" DROP CONSTRAINT "FK_ee32be0d48bb43e55e430862cad"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d16bcd920bc96d726d179b6cce"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ee32be0d48bb43e55e430862ca"`);
        await queryRunner.query(`ALTER TABLE "authority_feature_key" ADD CONSTRAINT "FK_d16bcd920bc96d726d179b6cceb" FOREIGN KEY ("feature_key") REFERENCES "feature_key"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "authority_feature_key" ADD CONSTRAINT "FK_ee32be0d48bb43e55e430862cad" FOREIGN KEY ("authority") REFERENCES "jhi_authority"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
