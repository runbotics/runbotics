import { CredentialTemplateAttribute } from '#/scheduler-database/credential-template-attribute/credential-template-attribute.entity';

export class CreateCredentialTemplateDto {
    name: string;
    description: string;
    attributes: CredentialTemplateAttribute[];
    tenantId?: string;
}
