import React, { FC } from 'react';

import { Grid, Stack, Typography } from '@mui/material';
import clsx from 'clsx';
import { FeatureKey } from 'runbotics-common';
import styled from 'styled-components';

import If from '#src-app/components/utils/If';
import useFeatureKey from '#src-app/hooks/useFeatureKey';
import useTranslations from '#src-app/hooks/useTranslations';

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

const Header: FC<HeaderProps> = ({ className, ...rest }) => {
    const { translate } = useTranslations();
    const hasProcessAddAccess = useFeatureKey([FeatureKey.PROCESS_ADD]);
    const hasAddCollectionAccess = useFeatureKey([FeatureKey.PROCESS_COLLECTION_ADD]);

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
