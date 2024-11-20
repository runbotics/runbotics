import { z } from 'zod';
import { createGlobalVariableSchema } from '#/scheduler-database/global-variable/dto/create-global-variable.dto';
import { processOutputReferenceSchema } from '#/scheduler-database/process-output/dto/process-output-reference';
import { tagReferenceSchema } from '#/scheduler-database/tags/dto/tag-reference';
import { botSystemReferenceSchema } from '#/scheduler-database/bot-system/dto/bot-system-reference';
import { processCollectionReferenceSchema } from '#/database/process-collection/dto/process-collection-reference';
import { botCollectionReferenceSchema } from '#/database/bot-collection/dto/bot-collection-reference';
import { BotSystemType, ProcessOutputType } from 'runbotics-common';

export const createProcessSchema = z.object({
    name: z.string().trim().min(1).max(255),
    description: z.string(),
    definition: z.string(),
    isPublic: z.boolean(),
    isAttended: z.boolean().default(false),
    executionInfo: z.string().trim().or(z.null()).optional(),
    isTriggerable: z.boolean().default(false),
    system: botSystemReferenceSchema
        .default({
            name: BotSystemType.ANY,
        }),
    botCollection: botCollectionReferenceSchema.optional(),
    processCollection: processCollectionReferenceSchema.optional(),
    globalVariables: z.array(createGlobalVariableSchema).default([]),
    output: processOutputReferenceSchema
        .default({
            type: ProcessOutputType.JSON,
        }),
    tags: z.array(tagReferenceSchema),
});

export type CreateProcessDto = z.infer<typeof createProcessSchema>;
