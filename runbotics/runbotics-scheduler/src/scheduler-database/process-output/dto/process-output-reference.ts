import { z } from 'zod';
import { ProcessOutputType } from 'runbotics-common';

export const processOutputReferenceSchema = z.object({
    type: z.nativeEnum(ProcessOutputType),
});
