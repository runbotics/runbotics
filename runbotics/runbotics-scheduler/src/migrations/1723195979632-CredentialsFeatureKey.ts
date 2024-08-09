import { AuthorityEntity } from '#/database/authority/authority.entity';
import { FeatureKeyEntity } from '#/database/feature-key/feature-key.entity';
import { FeatureKey, Role } from 'runbotics-common';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CredentialsFeatureKey1723195979632 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager
            .insert(FeatureKeyEntity, { name: FeatureKey.CREDENTIALS_PAGE_READ });

        const newAuthorityTenantAdmin = await queryRunner.manager
            .getRepository(AuthorityEntity)
            .findOneByOrFail({ name: Role.ROLE_TENANT_ADMIN })
            .then(authority => {
                authority.featureKeys = [...authority.featureKeys, { name: FeatureKey.CREDENTIALS_PAGE_READ }];

                return authority;
            });

        await queryRunner.manager
            .getRepository(AuthorityEntity)
            .save(newAuthorityTenantAdmin);

            const newAuthorityAdmin = await queryRunner.manager
            .getRepository(AuthorityEntity)
            .findOneByOrFail({ name: Role.ROLE_ADMIN })
            .then(authority => {
                authority.featureKeys = [...authority.featureKeys, { name: FeatureKey.CREDENTIALS_PAGE_READ }];

                return authority;
            });

        await queryRunner.manager
            .getRepository(AuthorityEntity)
            .save(newAuthorityAdmin);

            await queryRunner.manager
            .getRepository(AuthorityEntity)
            .save(newAuthorityTenantAdmin);

            const newAuthorityUser = await queryRunner.manager
            .getRepository(AuthorityEntity)
            .findOneByOrFail({ name: Role.ROLE_USER })
            .then(authority => {
                authority.featureKeys = [...authority.featureKeys, { name: FeatureKey.CREDENTIALS_PAGE_READ }];

                return authority;
            });

        await queryRunner.manager
            .getRepository(AuthorityEntity)
            .save(newAuthorityUser);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const authorityUSer = await queryRunner.manager
            .getRepository(AuthorityEntity)
            .findOneByOrFail({ name: Role.ROLE_TENANT_ADMIN })
            .then(authority => ({ 
                ...authority, 
                featureKeys: authority.featureKeys.filter(featureKey => featureKey.name !== FeatureKey.CREDENTIALS_PAGE_READ) 
            }));

        await queryRunner.manager.save(AuthorityEntity, authorityUSer);

        await queryRunner.manager.delete(FeatureKeyEntity, { name: FeatureKey.CREDENTIALS_PAGE_READ });

        const authorityAdmin = await queryRunner.manager
            .getRepository(AuthorityEntity)
            .findOneByOrFail({ name: Role.ROLE_TENANT_ADMIN })
            .then(authority => ({ 
                ...authority, 
                featureKeys: authority.featureKeys.filter(featureKey => featureKey.name !== FeatureKey.CREDENTIALS_PAGE_READ) 
            }));

        await queryRunner.manager.save(AuthorityEntity, authorityAdmin);

        await queryRunner.manager.delete(FeatureKeyEntity, { name: FeatureKey.CREDENTIALS_PAGE_READ });
        const authorityTenantAdmin = await queryRunner.manager
            .getRepository(AuthorityEntity)
            .findOneByOrFail({ name: Role.ROLE_TENANT_ADMIN })
            .then(authority => ({ 
                ...authority, 
                featureKeys: authority.featureKeys.filter(featureKey => featureKey.name !== FeatureKey.CREDENTIALS_PAGE_READ) 
            }));

        await queryRunner.manager.save(AuthorityEntity, authorityTenantAdmin);

        await queryRunner.manager.delete(FeatureKeyEntity, { name: FeatureKey.CREDENTIALS_PAGE_READ });
    }
}
