import { z } from 'zod';
import { AccessType, Color } from '../credential-collection.entity';
import { PrivilegeType } from '#/scheduler-database/credential-collection-user/credential-collection-user.entity';

export const createCredentialCollectionSchema = z
    .object({
        name: z.string(),
        description: z.string().optional().nullable(),
        accessType: z.nativeEnum(AccessType).optional(),
        color: z.nativeEnum(Color).optional(),
        sharedWith: z
            .object({
                login: z.string(),
                privilegeType: z.nativeEnum(PrivilegeType),
            })
            .array()
            .optional(),
    })
    .strict()
    .required()
    .refine(
        (input) =>
            !(input.accessType === AccessType.GROUP && !input.sharedWith),
        {
            message: `For accessType: ${AccessType.GROUP} sharedWith must be a valid array`,
        }
    );

type CreateCredentialCollectionPartial = z.infer<
    typeof createCredentialCollectionSchema
>;

export type CreateCredentialCollectionDto = CreateCredentialCollectionPartial &
    Required<Pick<CreateCredentialCollectionPartial, 'name' | 'accessType'>>;
