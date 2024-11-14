import { UserDTO } from "./user.model";

export interface Tenant {
    id?: string;
    name?: string;
    createdBy?: string;
    createdByUser?: UserDTO;
    created?: string | null;
    updated?: string | null;
    lastModifiedBy?: string | null;
}

export interface TenantInviteCode {
    inviteCode: string;
}
