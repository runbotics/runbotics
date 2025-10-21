import { z } from 'zod';

export const CreateWebhookPayloadDtoSchema = z.object({
    webhookIdPath: z.string().min(1),
    payloadDataPath: z.string().min(1),
});

export type CreateWebhookPayloadDto = z.infer<typeof CreateWebhookPayloadDtoSchema>;

export const UpdateWebhookPayloadDtoSchema = z.object({
    webhookIdPath: z.string().min(1).optional(),
    payloadDataPath: z.string().min(1).optional(),
});

export type UpdateWebhookPayloadDto = z.infer<typeof UpdateWebhookPayloadDtoSchema>;
