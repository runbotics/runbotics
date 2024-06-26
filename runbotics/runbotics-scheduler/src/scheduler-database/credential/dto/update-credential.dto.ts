import { PickType } from '@nestjs/mapped-types';
import { CreateCredentialDto } from './create-credential.dto';

export class UpdateCredentialDto extends PickType(CreateCredentialDto, ['name', 'description'] as const) {}
