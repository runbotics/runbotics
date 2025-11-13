import { useMemo } from 'react';

import { useSelector } from 'react-redux';
import {
    DEFAULT_TENANT_ID,
    getRolesAllowedInDefaultTenant,
    getRolesAllowedInTenant,
    Role,
} from 'runbotics-common';

import { authSelector } from '#src-app/store/slices/Auth';
import {
    getAllUserRoles,
    getAllUserRolesExceptAdmin,
} from '#src-app/views/users/UsersBrowseView/UsersBrowseView.utils';

export const useAllowedRoles = () => {
    const authUser = useSelector(authSelector);

    return useMemo(() => {
        const userRole = authUser.user.roles[0];
        const userTenantId = authUser.user.tenant.id;
        if (
            userTenantId === DEFAULT_TENANT_ID &&
            userRole === Role.ROLE_TENANT_ADMIN
        ) {
            return getRolesAllowedInDefaultTenant();
        }
        if (
            userTenantId === DEFAULT_TENANT_ID &&
            userRole === Role.ROLE_ADMIN
        ) {
            return getAllUserRoles();
        }
        if (
            userTenantId !== DEFAULT_TENANT_ID &&
            userRole === Role.ROLE_TENANT_ADMIN
        ) {
            return getRolesAllowedInTenant();
        }
        if (
            userTenantId !== DEFAULT_TENANT_ID &&
            userRole === Role.ROLE_ADMIN
        ) {
            return getAllUserRolesExceptAdmin();
        }
        return [];
    }, [authUser]);
};
