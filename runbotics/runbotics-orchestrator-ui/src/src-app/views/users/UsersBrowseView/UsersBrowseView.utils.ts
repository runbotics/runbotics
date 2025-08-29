import { FeatureKey, Role } from 'runbotics-common';

import useAuth from '#src-app/hooks/useAuth';
import useTranslations from '#src-app/hooks/useTranslations';
import { UsersTab } from '#src-app/utils/users-tab';

import { UsersTabsHookProps } from './UsersBrowseView.types';

export const useUsersTabs = (): UsersTabsHookProps[]  => {
    const { translate } = useTranslations();
    const { user: { featureKeys } } = useAuth();

    const userTabs = [
        {
            value: UsersTab.ALL_USERS,
            label: translate('Users.Browse.Tabs.AllUsers.Label'),
            featureKeys: [FeatureKey.TENANT_READ_USER]
        },
        {
            value: UsersTab.WAITING_USERS,
            label: translate('Users.Browse.Tabs.Registration.Label'),
            featureKeys: [FeatureKey.TENANT_READ_USER, FeatureKey.MANAGE_INACTIVE_USERS]
        }
    ];

    return userTabs.filter((tab) =>
        tab.featureKeys.some((fk) => featureKeys.includes(fk))
    );
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

export const getAllUserRoles = (): Role[] => Object.values(Role).filter(role => role !== Role.ROLE_USER); // Todo: remove filter from final form  

export const getTenantAllowedRoles = () => [Role.ROLE_RPA_USER, Role.ROLE_EXTERNAL_USER, Role.ROLE_TENANT_ADMIN];

export const formatUserRoles = (roles: Role[]) => roles.map((role) => role.match(/^ROLE_(.*)/)[1]);
