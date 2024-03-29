import React, { VoidFunctionComponent } from 'react';

import { Typography, Grid } from '@mui/material';
import clsx from 'clsx';
import styled from 'styled-components';

import useTranslations from '#src-app/hooks/useTranslations';

const PREFIX = 'SchedulerHeader';

const classes = {
    root: `${PREFIX}-root`,
    action: `${PREFIX}-action`,
};

const StyledGrid = styled(Grid)(({ theme }) => ({
    [`&.${classes.root}`]: {},

    [`& .${classes.action}`]: {
        marginBottom: theme.spacing(1),
        '& + &': {
            marginLeft: theme.spacing(1),
        },
    },
}));

interface HeaderProps {
    className?: string;
}

const Header: VoidFunctionComponent<HeaderProps> = ({ className, ...rest }) => {
    const { translate } = useTranslations();

    return (
        <StyledGrid
            container
            spacing={3}
            justifyContent="space-between"
            className={clsx(classes.root, className)}
            {...rest}
        >
            <Grid item>
                <Typography variant="h3" color="textPrimary">
                    {translate('Scheduler.Common.Title')}
                </Typography>
            </Grid>
        </StyledGrid>
    );
};

export default Header;
