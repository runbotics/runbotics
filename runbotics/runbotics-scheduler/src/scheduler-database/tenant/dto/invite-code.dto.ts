import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';


export const tenantInviteCodeSchema = z.object({
    inviteCode: z.string()
}).required();

export class TenantInviteCodeSwaggerDto extends createZodDto(tenantInviteCodeSchema) {}
export type TenantInviteCodeDto = z.infer<typeof tenantInviteCodeSchema>;
