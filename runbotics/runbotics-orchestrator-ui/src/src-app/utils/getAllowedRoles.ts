import {
    DEFAULT_TENANT_ID,
    getRolesAllowedInDefaultTenant,
    getRolesAllowedInTenant,
    Role,
} from 'runbotics-common';

import { AuthState } from '#src-app/store/slices/Auth';
import {
    getAllUserRoles,
    getAllUserRolesExceptAdmin,
} from '#src-app/views/users/UsersBrowseView/UsersBrowseView.utils';

export const getAllowedRoles = (user: AuthState) => {
    const userRole = user.user?.roles[0];
    const userTenantId = user.user.tenant.id;
    if (
        userTenantId === DEFAULT_TENANT_ID &&
        userRole === Role.ROLE_TENANT_ADMIN
    ) {
        return getRolesAllowedInDefaultTenant();
    }
    if (userTenantId === DEFAULT_TENANT_ID && userRole === Role.ROLE_ADMIN) {
        return getAllUserRoles();
    }
    if (
        userTenantId !== DEFAULT_TENANT_ID &&
        userRole === Role.ROLE_TENANT_ADMIN
    ) {
        return getRolesAllowedInTenant();
    }
    if (userTenantId !== DEFAULT_TENANT_ID && userRole === Role.ROLE_ADMIN) {
        return getAllUserRolesExceptAdmin();
    }
    return [];
};
