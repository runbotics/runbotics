import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const updatesubscriptionProcessNotificationsDto = z.object({
    customEmail: z.string().trim().email().nullable(),
});

export class UpdateSubscriptionSwaggerDto extends createZodDto(updatesubscriptionProcessNotificationsDto) {
}

export type UpdateSubscriptionDto = z.infer<
    typeof updatesubscriptionProcessNotificationsDto
>;
