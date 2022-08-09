import React from 'react';
import styled from 'styled-components';
import type { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import {
    Breadcrumbs, Grid, Link, Typography,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import AddProcess from '../AddProcess';
import useFeatureKey from 'src/hooks/useFeatureKey';
import { FeatureKey } from 'runbotics-common';
import If from 'src/components/utils/If';

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
    const hasAccessToProcessAdd = useFeatureKey([FeatureKey.PROCESS_ADD]);

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
                    See the latest solutions
                </Typography>
            </Grid>
            <Grid item>
                <If condition={hasAccessToProcessAdd}>
                    <AddProcess />
                </If>
            </Grid>
        </StyledGrid>
    );
};

export default Header;
