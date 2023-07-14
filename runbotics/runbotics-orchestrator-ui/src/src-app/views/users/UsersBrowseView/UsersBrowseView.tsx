import React, { ChangeEvent, useMemo, VFC } from 'react';

import { Box, Tab, Tabs } from '@mui/material';
import { useRouter } from 'next/router';
import { FeatureKey } from 'runbotics-common';

import InternalPage from '#src-app/components/pages/InternalPage';
import If from '#src-app/components/utils/If';
import useFeatureKey from '#src-app/hooks/useFeatureKey';
import useTranslations from '#src-app/hooks/useTranslations';
import { UsersTabs } from '#src-app/utils/users-tab';

import UsersListView from '../UsersListView';
import UsersRegisterView from '../UsersRegisterView';

import { StyledHeader } from './UsersBrowseView.styles';

const UsersBrowseView: VFC = () => {
    const router = useRouter();
    const tab = router.asPath.split('/').slice(-1)[0].split('?')[0];
    const { translate } = useTranslations();
    const hasUsersPageRead = useFeatureKey([FeatureKey.USERS_PAGE_READ]);

    const usersTabs = useMemo(() => {
        const tabs = [];

        if (hasUsersPageRead) {
            tabs.push({ value: UsersTabs.ALL_USERS, label: translate('Users.Browse.Tabs.AllUsers.Label') });
            tabs.push({ value: UsersTabs.WAITING_USERS, label: translate('Users.Browse.Tabs.Registration.Label') });
        }

        return tabs;
    }, [hasUsersPageRead, translate]);

    const handleTabChange = (event: ChangeEvent<HTMLInputElement>, value: UsersTabs) => {
        if (value === UsersTabs.ALL_USERS) router.push('/app/users', null, { locale: router.locale });
        else router.push('/app/users/pending', null, { locale: router.locale });
    };

    const getTabValue = () => 
        tab === UsersTabs.ALL_USERS ? UsersTabs.ALL_USERS : UsersTabs.WAITING_USERS;

    const getPageTitle = () =>
        getTabValue() === UsersTabs.ALL_USERS
            ? translate('Users.Browse.Tabs.AllUsers.Title')
            : translate('Users.Browse.Tabs.Registration.Title'); 

    return (
        <> 
            <InternalPage title={getPageTitle()}>
                <StyledHeader/>
                <Box>
                    <If condition={hasUsersPageRead}>
                        <Tabs
                            onChange={handleTabChange}
                            scrollButtons="auto"
                            textColor="secondary"
                            value={getTabValue()}
                            variant="scrollable"
                        >
                            {usersTabs.map((usersTab) => (
                                <Tab key={usersTab.value} label={usersTab.label} value={usersTab.value} />
                            ))}
                        </Tabs>
                    </If>
                </Box>
                <If 
                    condition={tab === UsersTabs.ALL_USERS && hasUsersPageRead}
                    else={<UsersRegisterView />}
                >
                    <UsersListView />
                </If>
            </InternalPage>
        </>
    );
};

export default UsersBrowseView;
