import { z } from 'zod';
import { CreateClientRegistrationWebhookDtoSchema } from './client-registration-webhook.dto';

const partialClientRegistrationWebhookDtoSchema = CreateClientRegistrationWebhookDtoSchema.pick({
    applicationRequestType: true,
    applicationUrl: true,
});

export const deleteClientRegistrationWebhookDtoSchema = partialClientRegistrationWebhookDtoSchema.extend({
    unregisterPayload: z.record(z.any()).nullable().optional()
});

export type DeleteClientRegistrationWebhookDto = z.infer<typeof deleteClientRegistrationWebhookDtoSchema>;

