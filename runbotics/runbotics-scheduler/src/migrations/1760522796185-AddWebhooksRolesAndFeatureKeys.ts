import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWebhooksRolesAndFeatureKeys1760522796185 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
                INSERT INTO public."feature_key" (name)
                VALUES ('WEBHOOKS_PAGE_READ'),
                       ('WEBHOOKS_SERVICE_ACCESS')
            `);
        await queryRunner.query(`
            INSERT INTO public.jhi_authority (name)
            VALUES ('ROLE_SERVICE_ACCOUNT')
        `);
        await queryRunner.query(`
            INSERT INTO public.authority_feature_key (authority, feature_key)
            VALUES ('ROLE_TENANT_ADMIN', 'WEBHOOKS_PAGE_READ'),
                   ('ROLE_SERVICE_ACCOUNT', 'WEBHOOKS_SERVICE_ACCESS')`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE
            FROM public.authority_feature_key
            WHERE (authority = 'ROLE_TENANT_ADMIN' AND feature_key = 'WEBHOOKS_PAGE_READ')
               OR (authority = 'ROLE_SERVICE_ACCOUNT' AND feature_key = 'WEBHOOKS_SERVICE_ACCESS');
        `);

        await queryRunner.query(`
            DELETE
            FROM public.jhi_authority
            WHERE name = 'ROLE_SERVICE_ACCOUNT';
        `);

        await queryRunner.query(`
            DELETE
            FROM public."feature_key"
            WHERE name IN ('WEBHOOKS_PAGE_READ', 'WEBHOOKS_SERVICE_ACCESS');
        `);

    }

}
