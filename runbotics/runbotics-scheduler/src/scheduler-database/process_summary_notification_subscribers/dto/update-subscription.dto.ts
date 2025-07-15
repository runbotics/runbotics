import { z } from 'zod';

export const updatesubscriptionProcessNotificationsDto = z.object({
    customEmail: z.string().email().nullable(),
});

export type UpdateSubscriptionDto = z.infer<
    typeof updatesubscriptionProcessNotificationsDto
>;
