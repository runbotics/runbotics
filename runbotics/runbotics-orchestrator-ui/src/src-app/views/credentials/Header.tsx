import React, { ChangeEvent, FC } from 'react';

import { Grid, Stack, Tab, Tabs } from '@mui/material';
import clsx from 'clsx';
import { useRouter } from 'next/router';

import styled from 'styled-components';

import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';

import AddCredentialButton from './Credential/AddCredentialButton';
import AddCredentialsCollection from './CredentialsCollection/AddCredentialsCollection';
import { getLastParamOfUrl } from '../utils/routerUtils';

const PREFIX = 'Header';

const classes = {
    root: `${PREFIX}-root`,
};

const StyledGrid = styled(Grid)(() => ({
    [`&.${classes.root}`]: {},
}));

interface HeaderProps {
    className?: string;
}

export enum CredentialsTabs {
    CREDENTIALS = 'credentials',
    COLLECTIONS = 'collections'
}

const Header: FC<HeaderProps> = ({ className, ...rest }) => {
    const { translate } = useTranslations();

    const router = useRouter();
    // const searchParams = useSearchParams();

    const currentTab = getLastParamOfUrl(router);

    // const currentPage = parseInt(searchParams.get('page')) ?? DefaultPageValue.PAGE;
    // const pageSize = parseInt(searchParams.get('pageSize')) ?? DefaultPageSize.GRID;

    const onTabChange = (event: ChangeEvent<HTMLInputElement>, tabValue: CredentialsTabs) => {
        if (tabValue === CredentialsTabs.CREDENTIALS) {
            router.replace({
                pathname: '/app/credentials',
                // query: {
                //     pageSize: pageSize,
                //     page: currentPage
                // }
            });
        } else {
            router.replace({
                pathname: '/app/credentials/collections',
                // query: {
                //     pageSize: pageSize,
                //     page: currentPage
                // }
            });
        }
    };

    const credenitalsTabs = (
        <Tabs
            onChange={onTabChange}
            value={currentTab}
            textColor="secondary"
        >
            <Tab
                key={CredentialsTabs.CREDENTIALS}
                value={CredentialsTabs.CREDENTIALS}
                label={translate('Credentials.Tab.Credentials')}
            />
            <Tab
                key={CredentialsTabs.COLLECTIONS}
                value={CredentialsTabs.COLLECTIONS}
                label={translate('Credentials.Tab.Collections')}
            />
        </Tabs>
    );

    return (
        <StyledGrid
            alignItems="center"
            container
            justifyContent="space-between"
            spacing={3}
            className={clsx(classes.root, className)}
            {...rest}
        >
            <Grid item>
                {credenitalsTabs}
            </Grid>
            <Grid item>
                <Stack direction="row" spacing={2}>
                    <If condition={currentTab === CredentialsTabs.CREDENTIALS}>
                        <AddCredentialButton/>
                    </If>
                    <If condition={currentTab === CredentialsTabs.COLLECTIONS}>
                        <AddCredentialsCollection/>
                    </If>
                    <If condition={currentTab !== CredentialsTabs.CREDENTIALS && currentTab !== CredentialsTabs.COLLECTIONS}>
                        <AddCredentialButton/>
                        <AddCredentialsCollection/>
                    </If>
                </Stack>
            </Grid>
        </StyledGrid>
    );
};

export default Header;
