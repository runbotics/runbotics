import { z } from 'zod';
import { NotificationProcessType } from 'runbotics-common';

export const createNotificationProcessSchema = z.object({
    processId: z.number(),
    type: z.nativeEnum(NotificationProcessType)
}).required();

export type CreateNotificationProcessDto = z.infer<typeof createNotificationProcessSchema>;