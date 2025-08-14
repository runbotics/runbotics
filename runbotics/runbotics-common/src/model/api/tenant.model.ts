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
    activePlugins?: number | null;
    subscriptionEnd?: string | null;
}

export interface TenantInviteCode {
    inviteCode: string;
}

export interface BasicTenantDto {
    id: string;
    name: string;
    subscriptionEnd?: string | null;
}

