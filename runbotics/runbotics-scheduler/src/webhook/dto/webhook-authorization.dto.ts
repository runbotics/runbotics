import { z } from 'zod';
import { WebhookAuthorizationType } from 'runbotics-common';

export const CreateWebhookAuthorizationDtoSchema = z.object({
    type: z.nativeEnum(WebhookAuthorizationType),
    data: z.record(z.any()).nullable().optional(),
});

export type CreateWebhookAuthorizationDto = z.infer<typeof CreateWebhookAuthorizationDtoSchema>;

export const UpdateWebhookAuthorizationDtoSchema = z.object({
    type: z.nativeEnum(WebhookAuthorizationType).optional(),
    data: z.record(z.any()).nullable().optional(),
});

export type UpdateWebhookAuthorizationDto = z.infer<typeof UpdateWebhookAuthorizationDtoSchema>;
