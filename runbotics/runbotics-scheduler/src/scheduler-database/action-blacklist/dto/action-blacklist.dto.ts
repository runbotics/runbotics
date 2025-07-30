import { z } from 'zod';
import { ACTION_GROUP } from 'runbotics-common';
import { createZodDto } from 'nestjs-zod';

export const createActionBlacklistSchema = z.object({
    actionGroups: z.nativeEnum(ACTION_GROUP).array().optional(),
});

export const updateActionBlacklistSchema = createActionBlacklistSchema.partial();

export class CreateActionBlacklistZodDto extends createZodDto(createActionBlacklistSchema) {}
export class UpdateActionBlacklistZodDto extends createZodDto(updateActionBlacklistSchema) {}
export type CreateActionBlacklistDto = z.infer<typeof createActionBlacklistSchema>;
export type UpdateActionBlacklistDto = z.infer<typeof updateActionBlacklistSchema>;
