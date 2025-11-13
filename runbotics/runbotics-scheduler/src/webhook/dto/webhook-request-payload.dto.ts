import { z } from 'zod';

export const BodyDataSchema = z
    .object({
        webhookId: z.string(),
    })
    .passthrough();

export type BodyData = z.infer<typeof BodyDataSchema>;

export const WebhookRequestPayload = z
    .object({
        data: BodyDataSchema,
    })
    .passthrough();

export type WebhookRequestPayloadDto = z.infer<typeof WebhookRequestPayload>;
