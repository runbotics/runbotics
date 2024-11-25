import React, { ChangeEvent, FC } from 'react';

import { Grid, Stack, Tab, Tabs } from '@mui/material';
import clsx from 'clsx';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';

import { FeatureKey } from 'runbotics-common';
import styled from 'styled-components';

import If from '#src-app/components/utils/If';
import useFeatureKey from '#src-app/hooks/useFeatureKey';
import useTranslations from '#src-app/hooks/useTranslations';

import { DEFAULT_TABLE_PAGING_VALUES } from '#src-app/views/utils/TablePaging.provider';

import { DefaultPageSize } from './ProcessList/ProcessList.utils';
import { getLastParamOfUrl } from '../../utils/routerUtils';
import AddProcess from '../AddProcess';
import AddCollectionButton from '../ProcessCollectionView/AddCollection/AddCollectionButton';

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

export enum ProcessesTabs {
    PROCESSES = 'processes',
    COLLECTIONS = 'collections'
}

const Header: FC<HeaderProps> = ({ className, ...rest }) => {
    const { translate } = useTranslations();
    const hasProcessAddAccess = useFeatureKey([FeatureKey.PROCESS_ADD]);
    const hasAllProcessesReadAccess = useFeatureKey([FeatureKey.ALL_PROCESSES_READ]);
    const hasAddCollectionAccess = useFeatureKey([FeatureKey.PROCESS_COLLECTION_ADD]);


    const router = useRouter();
    const searchParams = useSearchParams();

    const currentTab = getLastParamOfUrl(router);

    const currentPage = parseInt(searchParams.get('page')) ?? DEFAULT_TABLE_PAGING_VALUES.page;
    const pageSize = parseInt(searchParams.get('pageSize')) ?? DefaultPageSize.GRID;

    const onTabChange = (event: ChangeEvent<HTMLInputElement>, value: ProcessesTabs) => {
        if (value === ProcessesTabs.COLLECTIONS) {
            router.replace({
                pathname: '/app/processes/collections',
                query: {
                    pageSize: pageSize,
                    page: currentPage
                }
            });
        } else {
            router.replace({
                pathname: '/app/processes',
                query: {
                    pageSize: pageSize,
                    page: currentPage
                }
            });
        }
    };

    const procesTabs = (
        <Tabs
            onChange={onTabChange}
            value={currentTab}
            textColor="secondary"
        >
            <Tab
                key={ProcessesTabs.COLLECTIONS}
                value={ProcessesTabs.COLLECTIONS}
                label={translate('Process.Collection.Navigation.Collections.Label')}
            />
            {hasAllProcessesReadAccess && (
                <Tab
                    key={ProcessesTabs.PROCESSES}
                    value={ProcessesTabs.PROCESSES}
                    label={translate('Process.Collection.Navigation.Processes.Label')}
                />
            )}
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
                {procesTabs}
            </Grid>
            <Grid item>
                <Stack direction="row" spacing={2}>
                    <If condition={hasProcessAddAccess}>
                        <AddProcess />
                    </If>
                    <If condition={hasAddCollectionAccess}>
                        <AddCollectionButton />
                    </If>
                </Stack>
            </Grid>
        </StyledGrid>
    );
};

export default Header;
