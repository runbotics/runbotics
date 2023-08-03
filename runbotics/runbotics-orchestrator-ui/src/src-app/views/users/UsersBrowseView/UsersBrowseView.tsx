import React, { ChangeEvent, VFC } from 'react';

import { Box, Tab, Tabs } from '@mui/material';
import { useRouter } from 'next/router';

import InternalPage from '#src-app/components/pages/InternalPage';
import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';
import { UsersTab } from '#src-app/utils/users-tab';

import UsersListView from '../UsersListView';
import UsersRegisterView from '../UsersRegisterView';

import { StyledUsersViewHeader } from './UsersBrowseView.styles';
import { useUsersTabs } from './UsersBrowseView.utils';

const UsersBrowseView: VFC = () => {
    const { translate } = useTranslations();
    const router = useRouter();
    const tab = router.pathname.match(/[^\/]+$/)[0];
    const usersTabs = useUsersTabs();

    const handleTabChange = (event: ChangeEvent<HTMLInputElement>, value: UsersTab) => {
        if (value === UsersTab.ALL_USERS) router.push('/app/users');
        else router.push('/app/users/pending');
    };

    const tabValue = tab === UsersTab.ALL_USERS ? UsersTab.ALL_USERS : UsersTab.WAITING_USERS;

    const pageTitle = tabValue === UsersTab.ALL_USERS
        ? translate('Users.Browse.Tabs.AllUsers.Title')
        : translate('Users.Browse.Tabs.Registration.Title'); 

    return (
        <> 
            <InternalPage title={pageTitle}>
                <StyledUsersViewHeader/>
                <Box>
                    <Tabs
                        onChange={handleTabChange}
                        scrollButtons="auto"
                        textColor="secondary"
                        value={tabValue}
                        variant="scrollable"
                    >
                        {usersTabs.map((usersTab) => (
                            <Tab key={usersTab.value} label={usersTab.label} value={usersTab.value} />
                        ))}
                    </Tabs>
                </Box>
                <If 
                    condition={tab === UsersTab.ALL_USERS}
                    else={<UsersRegisterView />}
                >
                    <UsersListView />
                </If>
            </InternalPage>
        </>
    );
};

export default UsersBrowseView;
