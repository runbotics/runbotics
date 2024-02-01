import React, { ChangeEvent, FC } from 'react';
import { useRouter } from 'next/router';

import { Grid, Stack, Tab, Tabs, Typography } from '@mui/material';
import clsx from 'clsx';
import { FeatureKey } from 'runbotics-common';
import styled from 'styled-components';

import If from '#src-app/components/utils/If';
import useFeatureKey from '#src-app/hooks/useFeatureKey';
import useTranslations from '#src-app/hooks/useTranslations';

import AddProcess from '../AddProcess';
import AddCollectionButton from '../ProcessCollectionView/AddCollection/AddCollectionButton';
import useQuery from '../../../hooks/useQuery';


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

enum ProcesTabs {
    PROCESSES = 'processes',
    COLLECTIONS = 'collections'
}

const Header: FC<HeaderProps> = ({ className, ...rest }) => {
    const { translate } = useTranslations();
    const hasProcessAddAccess = useFeatureKey([FeatureKey.PROCESS_ADD]);
    const hasAddCollectionAccess = useFeatureKey([FeatureKey.PROCESS_COLLECTION_ADD]);
    
    const router = useRouter();
    const currentTab = router.asPath.split('/').slice(-1)[0].split('?')[0];
    const { firstValueFrom } = useQuery();
    const collectionId = firstValueFrom('collection') ?? 1;

    const onTabChange = (event: ChangeEvent<HTMLInputElement>, value: ProcesTabs) => {
        if (value === ProcesTabs.COLLECTIONS) router.push(`/app/processes/collections?collection=${collectionId}`, null, { locale:router.locale });
        else router.push('/app/processes', null, { locale:router.locale });
    };

    const procesTabs = (
        <Tabs
            onChange={onTabChange}
            value={currentTab}
            textColor="secondary"
        >
            <Tab key={ProcesTabs.PROCESSES} value={ProcesTabs.PROCESSES} label={ProcesTabs.PROCESSES} /> 
            <Tab key={ProcesTabs.COLLECTIONS} value={ProcesTabs.COLLECTIONS} label={ProcesTabs.COLLECTIONS} />
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
                <Typography variant="h3" color="textPrimary">
                    {translate('Process.List.Header.Solutions')}
                </Typography>
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
