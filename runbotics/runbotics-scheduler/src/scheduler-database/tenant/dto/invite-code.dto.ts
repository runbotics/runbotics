import { z } from 'zod';


export const tenantInviteCodeSchema = z.object({
    inviteCode: z.string()
}).required();

export type TenantInviteCodeDto = z.infer<typeof tenantInviteCodeSchema>;
