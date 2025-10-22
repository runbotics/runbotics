import { createZodDto } from 'nestjs-zod';
import { Language } from 'runbotics-common';
import { z } from 'zod';

const UpdateLanguageSchema = z.object({
    langKey: z.nativeEnum(Language, {
        errorMap: () => ({ message: `Language must be one of: ${Object.values(Language).join(', ')}` })
    })
});

export class UpdateLanguageSwaggerDto extends createZodDto(UpdateLanguageSchema) {}
export type UpdateLanguageDto = z.infer<typeof UpdateLanguageSchema>;