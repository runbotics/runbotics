import { CreateCredentialTemplateDto } from './create-credential-template.dto';
import { PickType } from '@nestjs/mapped-types';

export class UpdateCredentialTemplateDto extends PickType(CreateCredentialTemplateDto, ['name', 'description', 'attributes'] as const) {}
