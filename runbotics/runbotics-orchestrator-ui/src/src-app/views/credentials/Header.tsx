import React, { ChangeEvent, FC } from 'react';

import { Grid, Stack, Tab, Tabs } from '@mui/material';
import clsx from 'clsx';
import { useRouter } from 'next/router';

import styled from 'styled-components';

import useTranslations from '#src-app/hooks/useTranslations';

// import { DefaultPageSize } from './ProcessList/ProcessList.utils';
// import { DefaultPageValue } from '../../users/UsersBrowseView/UsersBrowseView.utils';
import AddNewCredentialButton from './Credentials/AddNewCredentialButton';
import AddCollectionButton from '../process/ProcessCollectionView/AddCollection/AddCollectionButton';
import { getLastParamOfUrl } from '../utils/routerUtils';
// import AddProcess from '../AddProcess';
// import AddCollectionButton from '../ProcessCollectionView/AddCollection/AddCollectionButton';

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
    // const hasProcessAddAccess = useFeatureKey([FeatureKey.PROCESS_ADD]);
    // const hasAddCollectionAccess = useFeatureKey([FeatureKey.PROCESS_COLLECTION_ADD]);

    const router = useRouter();
    // const searchParams = useSearchParams();

    const currentTab = getLastParamOfUrl(router);

    // const currentPage = parseInt(searchParams.get('page')) ?? DefaultPageValue.PAGE;
    // const pageSize = parseInt(searchParams.get('pageSize')) ?? DefaultPageSize.GRID;

    const onTabChange = (event: ChangeEvent<HTMLInputElement>, value: CredentialsTabs) => {
        if (value === CredentialsTabs.CREDENTIALS) {
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
                    <AddNewCredentialButton/>
                    <AddCollectionButton/>
                    {/* <If condition={hasProcessAddAccess}>
                        <AddProcess />
                    </If>
                    <If condition={hasAddCollectionAccess}>
                        <AddCollectionButton />
                    </If> */}
                </Stack>
            </Grid>
        </StyledGrid>
    );
};

export default Header;
