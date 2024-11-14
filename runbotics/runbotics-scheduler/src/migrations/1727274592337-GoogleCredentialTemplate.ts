import { CredentialTemplateAttribute } from '#/scheduler-database/credential-template-attribute/credential-template-attribute.entity';
import { CredentialTemplate } from '#/scheduler-database/credential-template/credential-template.entity';
import { ActionCredentialType } from 'runbotics-common';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class GoogleCredentialTemplate1727274592337
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        const googleCredentialTemplate = await queryRunner.manager
            .getRepository(CredentialTemplate)
            .findOneOrFail({
                where: { name: ActionCredentialType.GOOGLE },
                relations: ['attributes'],
            });

        const attributesUpdates = {
            refreshToken: {
                name: 'email',
                description: 'Google API technical user email',
            },
            authCode: {
                name: 'key',
                description: 'Google API technical user private key',
            },
        };

        await Promise.all(
            googleCredentialTemplate.attributes.map(({ id, name }) =>
                queryRunner.manager.update(
                    CredentialTemplateAttribute,
                    id,
                    attributesUpdates[name]
                )
            )
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const googleCredentialTemplate = await queryRunner.manager
            .getRepository(CredentialTemplate)
            .findOneOrFail({
                where: { name: ActionCredentialType.GOOGLE },
                relations: ['attributes'],
            });

        const attributesUpdates = {
            email: {
                name: 'refreshToken',
                description: 'Refresh token for Google API',
            },
            key: {
                name: 'authCode',
                description: 'Authorization code for Google API',
            },
        };

        await Promise.all(
            googleCredentialTemplate.attributes.map(({ id, name }) =>
                queryRunner.manager.update(
                    CredentialTemplateAttribute,
                    id,
                    attributesUpdates[name]
                )
            )
        );
    }
}
