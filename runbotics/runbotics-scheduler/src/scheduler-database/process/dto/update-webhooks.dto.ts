import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const updateProcessWebhookSchema = z.object({
    webhookId: z.string()
});

export class UpdateProcessWebhookSwaggerDto extends createZodDto(updateProcessWebhookSchema) {}

export type UpdateProcessWebhookDto = z.infer<typeof updateProcessWebhookSchema>;
