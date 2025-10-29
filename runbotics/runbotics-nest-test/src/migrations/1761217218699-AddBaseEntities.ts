import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBaseEntities1761217218699 implements MigrationInterface {
    name = 'AddBaseEntities1761217218699';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "runbotics_nest_test"."webhook" ("id" SERIAL NOT NULL, "rb_url" character varying NOT NULL, "resources" character varying NOT NULL, "authorization" character varying NOT NULL, CONSTRAINT "PK_e6765510c2d078db49632b59020" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "runbotics_nest_test"."token" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id"))`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "runbotics_nest_test"."token"`);
        await queryRunner.query(`DROP TABLE "runbotics_nest_test"."webhook"`);
    }
}
