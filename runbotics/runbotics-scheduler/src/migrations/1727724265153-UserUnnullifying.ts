import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserUnnullifying1727724265153 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `UPDATE jhi_user SET lang_key = 'en' WHERE lang_key IS NULL`
        );
        await queryRunner.query(
            'UPDATE jhi_user SET created_date = NOW() WHERE created_date IS NULL'
        );
        await queryRunner.query(
            'UPDATE jhi_user SET last_modified_date = NOW() WHERE last_modified_date IS NULL'
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }
}
