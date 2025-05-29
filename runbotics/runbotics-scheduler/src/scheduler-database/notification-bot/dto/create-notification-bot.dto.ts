import { z } from 'zod';
import { NotificationBotType } from 'runbotics-common';

export const createNotificationBotSchema = z.object({
    botId: z.number(),
    type: z.nativeEnum(NotificationBotType),
    customEmail: z.string().optional(),
});
