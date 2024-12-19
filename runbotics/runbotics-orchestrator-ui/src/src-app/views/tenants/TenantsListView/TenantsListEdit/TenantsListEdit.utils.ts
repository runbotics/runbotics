import { Tenant } from 'runbotics-common';

export const MINIMUM_NAME_CHARACTERS = 2;

export const initialValidationState = {
    name: true
};

export const getTenantDataWithoutNulls = (tenantData: Tenant) => ({
    ...tenantData,
    name: tenantData?.name ?? '',
});

export const getTenantDataWithoutEmptyStrings = (tenantData: Tenant) => ({
    id: tenantData.id,
    name: tenantData.name === '' ? null : tenantData.name,
});

