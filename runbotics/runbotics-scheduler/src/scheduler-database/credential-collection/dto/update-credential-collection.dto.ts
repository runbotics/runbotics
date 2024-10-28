import { z } from 'zod';
import { AccessType, Color } from '../credential-collection.entity';
import { PrivilegeType } from '#/scheduler-database/credential-collection-user/credential-collection-user.entity';

export const updateCredentialCollectionSchema = z
    .object({
        name: z.string().optional(),
        description: z.string().optional().nullable(),
        accessType: z.nativeEnum(AccessType).optional(),
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
    .superRefine((input, ctx) => {
        if (input.accessType === AccessType.GROUP && !input.sharedWith) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `For accessType: ${AccessType.GROUP} sharedWith must be a valid array`
            });
        }
        if (input.accessType === AccessType.PRIVATE && input.sharedWith !== undefined) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `For accessType: ${AccessType.PRIVATE} sharedWith should not be defined`
            });
        }
    });

export type UpdateCredentialCollectionDto = z.infer<
    typeof updateCredentialCollectionSchema
>;
