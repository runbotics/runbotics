import { License, Tenant } from 'runbotics-common';

import { Page } from '#src-app/utils/types/page';

export interface TenantsState {
    loading: boolean;
    all: Tenant[];
    allByPage: Page<Tenant> | null;
    inviteCode: string | null;
    invitingTenant: string | null;
    plugins: {
        all: {
            loading: boolean;
            error: string | null,
            data: License[];
        },
        createPlugin: {
            loading: boolean;
            error: string | null;
        },
        updatePlugin: {
            loading: boolean;
            error: string | null;
        },
    };
}
