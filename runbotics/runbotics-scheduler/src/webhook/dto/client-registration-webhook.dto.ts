import { z } from 'zod';
import {
    CreateWebhookAuthorizationDtoSchema,
    UpdateWebhookAuthorizationDtoSchema,
} from '#/webhook/dto/webhook-authorization.dto';
import { CreateWebhookPayloadDtoSchema, UpdateWebhookPayloadDtoSchema } from '#/webhook/dto/webhook-payload.dto';

export const CreateClientRegistrationWebhookDtoSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    active: z.boolean().default(true),
    applicationUrl: z.string().url('Invalid URL'),

    clientAuthorization: CreateWebhookAuthorizationDtoSchema.optional(),
    payload: CreateWebhookPayloadDtoSchema.optional(),

    registrationPayload: z.record(z.any()).nullable().optional(),
});

export type CreateClientRegistrationWebhookDto = z.infer<typeof CreateClientRegistrationWebhookDtoSchema>;

export const UpdateClientRegistrationWebhookDtoSchema = z.object({
    name: z.string().min(1).optional(),
    tenantId: z.string().uuid().optional(),
    active: z.boolean().optional(),
    applicationUrl: z.string().url('Invalid URL').optional(),
    
    authorization: UpdateWebhookAuthorizationDtoSchema.optional(),
    clientAuthorization: UpdateWebhookAuthorizationDtoSchema.optional(),
    payload: UpdateWebhookPayloadDtoSchema.optional(),

    registrationPayload: z.record(z.any()).nullable().optional(),
});

export type UpdateClientRegistrationWebhookDto = z.infer<typeof UpdateClientRegistrationWebhookDtoSchema>;
