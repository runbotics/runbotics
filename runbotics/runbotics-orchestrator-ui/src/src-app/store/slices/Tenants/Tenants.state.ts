import { Tenant } from 'runbotics-common';

import { Page } from '#src-app/utils/types/page';

export interface TenantsState {
    loading: boolean;
    all: Tenant[];
    allByPage: Page<Tenant> | null;
    inviteCode: string | null;
    invitingTenant: string | null;
}
