import { Authority } from '#/scheduler-database/authority/authority.entity';
import { FeatureKey } from '#/scheduler-database/feature-key/feature-key.entity';
import { FeatureKey as FeatureKeyEnum, Role } from 'runbotics-common';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CredentialsFeatureKey1723195979632 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.insert(FeatureKey, { name: FeatureKeyEnum.CREDENTIALS_PAGE_READ });

        const newAuthorityTenantAdmin = await queryRunner.manager
            .getRepository(Authority)
            .findOneByOrFail({ name: Role.ROLE_TENANT_ADMIN })
            .then(authority => {
                authority.featureKeys = [...authority.featureKeys, { name: FeatureKeyEnum.CREDENTIALS_PAGE_READ }];

                return authority;
            });

        await queryRunner.manager.getRepository(Authority).save(newAuthorityTenantAdmin);

        const newAuthorityAdmin = await queryRunner.manager
            .getRepository(Authority)
            .findOneByOrFail({ name: Role.ROLE_ADMIN })
            .then(authority => {
                authority.featureKeys = [...authority.featureKeys, { name: FeatureKeyEnum.CREDENTIALS_PAGE_READ }];

                return authority;
            });

        await queryRunner.manager.getRepository(Authority).save(newAuthorityAdmin);

        await queryRunner.manager.getRepository(Authority).save(newAuthorityTenantAdmin);

        const newAuthorityUser = await queryRunner.manager
            .getRepository(Authority)
            .findOneByOrFail({ name: Role.ROLE_USER })
            .then(authority => {
                authority.featureKeys = [...authority.featureKeys, { name: FeatureKeyEnum.CREDENTIALS_PAGE_READ }];

                return authority;
            });

        await queryRunner.manager.getRepository(Authority).save(newAuthorityUser);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const authorityUSer = await queryRunner.manager
            .getRepository(Authority)
            .findOneByOrFail({ name: Role.ROLE_TENANT_ADMIN })
            .then(authority => ({
                ...authority,
                featureKeys: authority.featureKeys.filter(featureKey => featureKey.name !== FeatureKeyEnum.CREDENTIALS_PAGE_READ)
            }));

        await queryRunner.manager.save(Authority, authorityUSer);

        await queryRunner.manager.delete(FeatureKey, { name: FeatureKeyEnum.CREDENTIALS_PAGE_READ });

        const authorityAdmin = await queryRunner.manager
            .getRepository(Authority)
            .findOneByOrFail({ name: Role.ROLE_TENANT_ADMIN })
            .then(authority => ({
                ...authority,
                featureKeys: authority.featureKeys.filter(featureKey => featureKey.name !== FeatureKeyEnum.CREDENTIALS_PAGE_READ)
            }));

        await queryRunner.manager.save(Authority, authorityAdmin);

        await queryRunner.manager.delete(FeatureKey, { name: FeatureKeyEnum.CREDENTIALS_PAGE_READ });
        const authorityTenantAdmin = await queryRunner.manager
            .getRepository(Authority)
            .findOneByOrFail({ name: Role.ROLE_TENANT_ADMIN })
            .then(authority => ({
                ...authority,
                featureKeys: authority.featureKeys.filter(featureKey => featureKey.name !== FeatureKeyEnum.CREDENTIALS_PAGE_READ)
            }));

        await queryRunner.manager.save(Authority, authorityTenantAdmin);

        await queryRunner.manager.delete(FeatureKey, { name: FeatureKeyEnum.CREDENTIALS_PAGE_READ });
    }
}
