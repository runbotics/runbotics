import { z } from 'zod';

export const CreateWebhookProcessTriggerDtoSchema = z.object({
    tenantId: z.string().uuid(),
    webhook: z.string().uuid(),
    processId: z.number().int().positive(),
});

export type CreateWebhookProcessTriggerDto = z.infer<typeof CreateWebhookProcessTriggerDtoSchema>;

export const UpdateWebhookProcessTriggerDtoSchema = z.object({
    tenantId: z.string().uuid().optional(),
    webhook: z.string().uuid().optional(),
    processId: z.number().int().positive().optional(),
});

export type UpdateWebhookProcessTriggerDto = z.infer<typeof UpdateWebhookProcessTriggerDtoSchema>;
