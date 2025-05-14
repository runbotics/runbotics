import { z } from 'zod';
import { NotificationBotType } from 'runbotics-common';

export const createNotificationBotSchema = z.object({
    botId: z.number(),
    type: z.nativeEnum(NotificationBotType),
    email: z.string().optional(),
});

export type CreateNotificationBotDto = z.infer<typeof createNotificationBotSchema>;
