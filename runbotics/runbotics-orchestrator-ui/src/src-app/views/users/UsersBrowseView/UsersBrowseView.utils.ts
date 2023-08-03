import useTranslations from '#src-app/hooks/useTranslations';
import { UsersTab } from '#src-app/utils/users-tab';

import { UsersTabsHookProps } from './UsersBrowseView.types';

export enum DefaultPageValue {
    PAGE_SIZE = 10,
    PAGE = 0,
}

export const ROWS_PER_PAGE = [10, 20, 30];

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
