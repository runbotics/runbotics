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
    activePlugins?: number | null
}

export interface TenantInviteCode {
    inviteCode: string;
}

export interface BasicTenantDto {
    id: string;
    name: string;
}

export interface TenantPlugin {
    id: string;
    pluginName: string;
    tenantId: string;
    licenseKey: string;
    license: string;
    expDate: string;
}