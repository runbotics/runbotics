import { FeatureKeyEntity } from '#/database/feature-key/feature-key.entity';
import { FeatureKey } from 'runbotics-common';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class TenantInviteCodeFeatureKey1720103016207 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager
            .insert(FeatureKeyEntity, [
                { name: FeatureKey.TENANT_GET_ALL_INVITE_CODE },
                { name: FeatureKey.TENANT_CREATE_ALL_INVITE_CODE }
            ]);

        await queryRunner.query(`
            INSERT INTO public.authority_feature_key(feature_key, authority) VALUES
            ('TENANT_GET_ALL_INVITE_CODE', 'ROLE_ADMIN'),
            ('TENANT_CREATE_ALL_INVITE_CODE', 'ROLE_ADMIN')
            ON CONFLICT DO NOTHING;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager
            .delete(FeatureKeyEntity, [
                { name: FeatureKey.TENANT_GET_ALL_INVITE_CODE },
                { name: FeatureKey.TENANT_CREATE_ALL_INVITE_CODE }
            ]);

        await queryRunner.query(`
            DELETE FROM public.authority_feature_key
            WHERE feature_key IN
            ('TENANT_GET_ALL_INVITE_CODE', 'TENANT_CREATE_ALL_INVITE_CODE')
        `);
    }

}
