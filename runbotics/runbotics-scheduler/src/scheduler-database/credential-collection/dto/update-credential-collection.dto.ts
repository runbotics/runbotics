import { z } from 'zod';
import { AccessType, Color } from '../credential-collection.entity';
import { PrivilegeType } from '#/scheduler-database/credential-collection-user/credential-collection-user.entity';

export const updateCredentialCollectionSchema = z
    .object({
        name: z.string().optional(),
        description: z.string().optional(),
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
    .required()
    .refine(
        (input) =>
            !(input.accessType === AccessType.GROUP && !input.sharedWith),
        {
            message: `For accessType: ${AccessType.GROUP} sharedWith must be a valid array`,
        }
    );

type UpdateCredentialCollectionPartial = z.infer<
    typeof updateCredentialCollectionSchema
>;

export type UpdateCredentialCollectionDto = UpdateCredentialCollectionPartial;
