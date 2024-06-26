import { PickType } from '@nestjs/mapped-types';
import { CreateAttributeDto } from './create-attribute.dto';

export class UpdateAttributeDto extends PickType(CreateAttributeDto, ['value', 'masked'] as const) {}
