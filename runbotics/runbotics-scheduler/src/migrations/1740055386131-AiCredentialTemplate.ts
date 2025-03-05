import { CredentialTemplate } from "#/scheduler-database/credential-template/credential-template.entity";
import { ActionCredentialType } from "runbotics-common";
import { MigrationInterface, QueryRunner } from "typeorm";

export class AiCredentialTemplate1740055386131 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const credentialTemplateRepo = queryRunner.manager.getRepository(CredentialTemplate);
        const desktopTemplate = await credentialTemplateRepo.findOneBy({ name: ActionCredentialType.AI });
        if (desktopTemplate) {
            throw new Error(`Template name (${ActionCredentialType.AI}) already exists`);
        }

        await credentialTemplateRepo.save([{
            name: ActionCredentialType.AI,
            attributes: [
                {
                    name: 'apiKey',
                    description: 'OpenAI API key'
                },
            ]
        }]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const credentialTemplateRepo = queryRunner.manager.getRepository(CredentialTemplate);
        const desktopTemplate = await credentialTemplateRepo.findOneByOrFail({ name: ActionCredentialType.AI });

        await credentialTemplateRepo.remove(desktopTemplate);
    }
}
