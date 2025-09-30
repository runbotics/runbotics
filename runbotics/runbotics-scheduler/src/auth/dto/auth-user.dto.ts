import { z } from 'zod';
import { BasicTenantDtoSchema } from '#/scheduler-database/tenant/dto/tenant.dto';

const RolesSchema = z.array(z.string());

const FeatureKeysSchema = z.array(z.string());

export const AuthUserDtoSchema = z.object({
    id: z.number(),
    email: z.string(),
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    imageUrl: z.string().nullable(),
    langKey: z.string(),
    activated: z.boolean(),
    hasBeenActivated: z.boolean(),
    createdBy: z.string(),
    createdDate: z.string(),
    lastModifiedDate: z.string(),
    lastModifiedBy: z.string(),
    tenant: BasicTenantDtoSchema,
    roles: RolesSchema,
    featureKeys: FeatureKeysSchema,
});

export type AuthUserDto = z.infer<typeof AuthUserDtoSchema>;
