import { Tenant } from 'runbotics-common';

import { FormValidationState } from './TenantsListEdit.types';

export const MINIMUM_NAME_CHARACTERS = 2;

export const initialValidationState = {
    name: true,
    wasTenantNameChanged: false,
    wasWhitelistChanged: false,
};

export const getTenantDataWithoutNulls = (tenantData: Tenant) => ({
    ...tenantData,
    name: tenantData?.name ?? '',
});

export const getTenantDataWithoutEmptyStrings = (
    { id, name, emailTriggerWhitelist }: Tenant,
    { wasTenantNameChanged, wasWhitelistChanged }: FormValidationState
) => ({
    id,
    ...(wasTenantNameChanged && { name: name === '' ? null : name }),
    ...(wasWhitelistChanged && { emailTriggerWhitelist }),
});
