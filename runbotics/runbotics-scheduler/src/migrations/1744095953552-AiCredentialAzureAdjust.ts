import { CredentialTemplateAttribute } from '#/scheduler-database/credential-template-attribute/credential-template-attribute.entity';
import { CredentialTemplate } from "#/scheduler-database/credential-template/credential-template.entity";
import { ActionCredentialType } from "runbotics-common";
import { MigrationInterface, QueryRunner } from "typeorm";

export class AiCredentialAzureAdjust1744095953552 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const credentialTemplateRepo = queryRunner.manager.getRepository(CredentialTemplate);

        const aiTemplate = await credentialTemplateRepo
            .findOneOrFail({
                where: { name: ActionCredentialType.AI },
                relations: ['attributes'],
            })
            .catch(() => {
                throw new Error('Cannot find ai template in db');
            });

        const apiKeyAttrib = aiTemplate.attributes.find(attr => attr.name === 'apiKey');
        apiKeyAttrib.description = 'Azure OpenAI API key';

        await credentialTemplateRepo.save({
            ...aiTemplate,
            attributes: [apiKeyAttrib,
                {
                    name: 'apiInstanceName',
                    description: 'Azure instance name',
                },
                {
                    name: 'apiDeploymentName',
                    description: 'Azure deployment name',
                },
                {
                    name: 'apiVersion',
                    description: 'API Version',
                },
            ]
        });
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const credentialTemplateRepo = queryRunner.manager.getRepository(CredentialTemplate);

        const aiTemplate = await credentialTemplateRepo
            .findOneOrFail({
                where: { name: ActionCredentialType.AI },
                relations: ['attributes'],
            })
            .catch(() => {
                throw new Error('Cannot find ai template in db');
            });

        const attributes = await queryRunner.manager.find(CredentialTemplateAttribute, {
            where: { templateId: aiTemplate.id }
        });

        await queryRunner.manager.remove(attributes);
        const apiKeyAttrib = queryRunner.manager.create(CredentialTemplateAttribute, {
            name: 'apiKey',
            description: 'OpenAI API key',
        });

        aiTemplate.attributes = [apiKeyAttrib];
        await credentialTemplateRepo.save(aiTemplate);
    }
}
