import { Role } from 'runbotics-common';

import useTranslations from '#src-app/hooks/useTranslations';
import { UsersTab } from '#src-app/utils/users-tab';

import { UsersTabsHookProps } from './UsersBrowseView.types';

export const useUsersTabs = (): UsersTabsHookProps[]  => {
    const { translate } = useTranslations();

    return [
        {
            value: UsersTab.ALL_USERS,
            label: translate('Users.Browse.Tabs.AllUsers.Label')
        },
        {
            value: UsersTab.WAITING_USERS,
            label: translate('Users.Browse.Tabs.Registration.Label')
        }
    ];
};

export enum UserField {
    EMAIL = 'email',
    TENANT = 'tenant',
    ROLE = 'role',
    CREATED_BY = 'createdBy',
    CREATED_DATE = 'createdDate',
    LAST_MODIFIED_BY = 'lastModifiedBy',
    LAST_MODIFIED_DATE = 'lastModifiedDate',
};

export const getAllUserRoles = (): Role[] => Object.values(Role);

export const getTenantAllowedRoles = () => [Role.ROLE_USER, Role.ROLE_EXTERNAL_USER, Role.ROLE_TENANT_ADMIN];

export const formatUserRoles = (roles: Role[]) => roles.map((role) => role.match(/^ROLE_(.*)/)[1]);
