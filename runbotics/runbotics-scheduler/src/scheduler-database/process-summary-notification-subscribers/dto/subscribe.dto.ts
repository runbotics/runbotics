import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const subscribeProcessNotificationsDto = z.object({
    userId: z.number(),
    customEmail: z.string().trim().email().optional(),
    processId: z.number(),
});


export class SubscribeSwaggerDto extends createZodDto(subscribeProcessNotificationsDto){}
export type SubscribeDto = z.infer<
    typeof subscribeProcessNotificationsDto
>;
