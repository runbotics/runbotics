import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveAdminHistoryFK1747037438590 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.createQueryBuilder()
            .delete()
            .from('authority_feature_key')
            .where('authority = :authority AND feature_key = :featureKey', {
                authority: 'ROLE_ADMIN',
                featureKey: 'HISTORY_READ',
            })
            .execute();
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.createQueryBuilder()
            .insert()
            .into('authority_feature_key')
            .values({
                authority: 'ADMIN',
                featureKey: 'HISTORY_READ',
            })
            .execute();
    }
}
