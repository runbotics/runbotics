import { Tenant } from 'runbotics-common';

export interface TenantsListEditDialogProps {
    open: boolean;
    onClose: () => void;
    tenantData: Tenant;
};

export interface FormValidationState {
    name: boolean;
    wasChanged: boolean;
    wasTenantNameChanged: boolean;
    wasWhitelistChanged: boolean;
};

export interface TenantsListEditFormProps {
    tenant: Tenant;
    setTenant: (tenant) => void;
    formValidationState: FormValidationState;
    setFormValidationState: (state) => void;
    currentTenantName: string;
    currentWhitelist: string[];
};
