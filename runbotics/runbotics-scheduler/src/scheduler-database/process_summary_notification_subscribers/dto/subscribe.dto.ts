import { z } from 'zod';

export const subscribeProcessNotificationsDto = z.object({
    user_id: z.number(),
    customEmail: z.string().email().optional(),
    process_id: z.number(),
});

export type SubscribeDto = z.infer<
    typeof subscribeProcessNotificationsDto
>;
