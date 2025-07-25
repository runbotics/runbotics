import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const subscribeProcessNotificationsDto = z.object({
    user_id: z.number(),
    customEmail: z.string().trim().email().optional(),
    process_id: z.number(),
});


export class SubscribeSwaggerDto extends createZodDto(subscribeProcessNotificationsDto){}
export type SubscribeDto = z.infer<
    typeof subscribeProcessNotificationsDto
>;
