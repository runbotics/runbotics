import { Tenant, TenantPlugin } from 'runbotics-common';

import { Page } from '#src-app/utils/types/page';

export interface TenantsState {
    loading: boolean;
    all: Tenant[];
    allByPage: Page<Tenant> | null;
    inviteCode: string | null;
    invitingTenant: string | null;
    tenantPlugins: {
        allPlugins: {
            loading: boolean;
            error: string | ErrorConstructor;
            data: TenantPlugin[];
        },
        createPlugin: {
            loading: boolean;
            error: string | ErrorConstructor;
        },
        updatePlugin: {
            loading: boolean;
            error: string | ErrorConstructor;
        },
    };
}
