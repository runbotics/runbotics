import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';
import { Logger } from '#/utils/logger';

export class ZodValidationPipe implements PipeTransform {
    private readonly logger = new Logger(ZodValidationPipe.name);

    constructor(private schema: ZodSchema) {}

    transform(value: unknown, _metadata: ArgumentMetadata) {
        try {
            return this.schema.parse(value);
        } catch (error) {
            if (error instanceof ZodError) {
                throw new BadRequestException(error, { description: 'Validation error', cause: new Error('validation error') });
            }
            throw new BadRequestException('Unexpected validation error: ' + String(error));
        }
    }
}
