import { MigrationInterface, QueryRunner } from 'typeorm';

export class TenantInviteCodeFeatureKey1719490039764 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO public.feature_key(name) VALUES
            ('TENANT_GET_ALL_INVITE_CODE'),
            ('TENANT_CREATE_ALL_INVITE_CODE')
            ON CONFLICT DO NOTHING;
        `);

        await queryRunner.query(`
            INSERT INTO public.authority_feature_key(feature_key, authority) VALUES
            ('TENANT_GET_ALL_INVITE_CODE', 'ROLE_ADMIN'),
            ('TENANT_CREATE_ALL_INVITE_CODE', 'ROLE_ADMIN')
            ON CONFLICT DO NOTHING;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM public.feature_key
            WHERE name IN
            ('TENANT_GET_ALL_INVITE_CODE', 'TENANT_CREATE_ALL_INVITE_CODE')
        `);

        await queryRunner.query(`
            DELETE FROM public.authority_feature_key
            WHERE feature_key IN
            ('TENANT_GET_ALL_INVITE_CODE', 'TENANT_CREATE_ALL_INVITE_CODE')
        `);
    }
}
