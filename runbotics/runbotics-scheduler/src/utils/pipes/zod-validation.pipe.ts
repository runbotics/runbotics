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
                const formattedErrors = error.errors.map(err => {
                    return `Property "${err.path.join('.')}": ${err.message}`;
                }).join(', ');
                throw new BadRequestException(`Validation failed: ${formattedErrors}`);
            }

            throw new BadRequestException('Validation failed');
        }
    }
}
