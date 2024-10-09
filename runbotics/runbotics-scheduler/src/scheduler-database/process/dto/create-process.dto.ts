import { z } from 'zod';
import { createGlobalVariableSchema } from '#/scheduler-database/global-variable/dto/create-global-variable.dto';
import { processOutputReferenceSchema } from '#/scheduler-database/process-output/dto/process-output-reference';
import { tagReferenceSchema } from '#/scheduler-database/tags/dto/tag-reference';
import { userReferenceSchema } from '#/database/user/dto/user-reference';
import { botSystemReferenceSchema } from '#/scheduler-database/bot-system/dto/bot-system-reference';
import { processCollectionReferenceSchema } from '#/database/process-collection/dto/process-collection-reference';
import { botCollectionReferenceSchema } from '#/database/bot-collection/dto/bot-collection-reference';

export const createProcessSchema = z.object({
        name: z.string().length(255),
        description: z.string(),
        definition: z.string(),
        isPublic: z.boolean(),
        isAttended: z.boolean(),
        isTriggerable: z.boolean(),
        system: botSystemReferenceSchema,
        botCollection: botCollectionReferenceSchema,
        processCollection: processCollectionReferenceSchema,
        globalVariables: z.array(createGlobalVariableSchema),
        outputType: processOutputReferenceSchema,
        tags: z.array(tagReferenceSchema),
        editor: userReferenceSchema,
    });

export type CreateProcessDto = z.infer<typeof createProcessSchema>;
