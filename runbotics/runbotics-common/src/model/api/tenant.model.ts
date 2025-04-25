import { BasicUserDto } from "./user.model";

export interface Tenant {
    id?: string;
    name?: string;
    emailTriggerWhitelist?: string[];
    createdBy?: string;
    createdByUser?: BasicUserDto;
    created?: string | null;
    updated?: string | null;
    lastModifiedBy?: string | null;
    //TODO: add type of License
    licenses?: Record<string, unknown>;
}

export interface TenantInviteCode {
    inviteCode: string;
}

export interface BasicTenantDto {
    id: string;
    name: string;
}
