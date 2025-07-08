import { z } from 'zod';

export const userReferenceSchema = z.object({
    id: z.number(),
    privilegeType: z.string(),
}).required();
