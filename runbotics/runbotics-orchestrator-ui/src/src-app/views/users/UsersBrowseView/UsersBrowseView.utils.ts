import useTranslations from '#src-app/hooks/useTranslations';
import { UsersTab } from '#src-app/utils/users-tab';

export enum DefaultValue {
    PAGE_SIZE = 10,
    PAGE = 0,
}

export const ROWS_PER_PAGE = [10, 20, 30];

interface UsersTabsProps {
    value: string,
    label: string
}

export const useUsersTabs = (): UsersTabsProps[]  => {
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
