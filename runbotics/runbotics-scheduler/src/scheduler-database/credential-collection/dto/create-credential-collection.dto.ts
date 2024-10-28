import { z } from 'zod';
import { AccessType, Color } from '../credential-collection.entity';
import { PrivilegeType } from '#/scheduler-database/credential-collection-user/credential-collection-user.entity';
import { Reveal } from '#/utils/generic.types';

export const createCredentialCollectionSchema = z
    .object({
        name: z.string(),
        accessType: z.nativeEnum(AccessType),
        description: z.string().optional().nullable(),
        color: z.nativeEnum(Color).optional(),
        sharedWith: z
            .object({
                email: z.string(),
                privilegeType: z.nativeEnum(PrivilegeType),
            })
            .array()
            .optional(),
    })
    .strict()
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

export type CreateCredentialCollectionDto = Reveal<
    CreateCredentialCollectionPartial &
    Required<Pick<CreateCredentialCollectionPartial, 'name' | 'accessType'>>
>;
