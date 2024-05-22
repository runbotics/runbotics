import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
    constructor(private schema: ZodSchema) {}

    transform(value: unknown, _metadata: ArgumentMetadata) {
        try {
            return this.schema.parse(value);
        } catch (error) {
            console.log(error);
            throw new BadRequestException('Validation failed');
        }
    }
}
