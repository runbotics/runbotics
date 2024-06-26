import { PickType } from '@nestjs/mapped-types';
import { CreateCredentialTemplateAttributeDto } from './create-credential-template-attribute.dto';

export class UpdateCredentialTemplateAttributeDto extends PickType(
    CreateCredentialTemplateAttributeDto,
    ['name', 'description', 'type'] as const
) {}
