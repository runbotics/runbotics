import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProcessCollectionCascadeDelete1753168403555 implements MigrationInterface {
    name = 'ProcessCollectionCascadeDelete1753168403555';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "process_collection" DROP CONSTRAINT "FK_3c30da520c249192c358cf4beb3"');
        await queryRunner.query('ALTER TABLE "process_collection" ADD CONSTRAINT "FK_3c30da520c249192c358cf4beb3" FOREIGN KEY ("parent_id") REFERENCES "process_collection"("id") ON DELETE CASCADE ON UPDATE CASCADE');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "process_collection" DROP CONSTRAINT "FK_3c30da520c249192c358cf4beb3"');
        await queryRunner.query('ALTER TABLE "process_collection" ADD CONSTRAINT "FK_3c30da520c249192c358cf4beb3" FOREIGN KEY ("parent_id") REFERENCES "process_collection"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
    }

}
