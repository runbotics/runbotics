import React from 'react';
import styled from 'styled-components';
import type { FC } from 'react';
import clsx from 'clsx';
import { Grid, Typography } from '@mui/material';
import useFeatureKey from 'src/hooks/useFeatureKey';
import { FeatureKey } from 'runbotics-common';
import If from 'src/components/utils/If';
import useTranslations from 'src/hooks/useTranslations';
import AddProcess from '../AddProcess';

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
                <If condition={hasProcessAddAccess}>
                    <AddProcess />
                </If>
            </Grid>
        </StyledGrid>
    );
};

export default Header;
