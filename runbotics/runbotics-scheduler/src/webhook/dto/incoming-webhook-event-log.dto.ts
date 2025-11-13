import { z } from 'zod';

export const CreateWebhookIncomingEventLogDtoSchema = z.object({
    payload: z.string().nullable().optional(),
    authorization: z.string().nullable().optional(),
    status: z.string().nullable().optional(),
    error: z.string().nullable().optional(),
});

export type CreateWebhookIncomingEventLogDto = z.infer<typeof CreateWebhookIncomingEventLogDtoSchema>;
