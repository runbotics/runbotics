import React from 'react';
import styled from 'styled-components';
import type { FC } from 'react';
import RouterLink from 'next/link';
import clsx from 'clsx';
import {
    AppBar, Box, Hidden, Toolbar, Typography,
} from '@mui/material';
import Logo from 'src/components/utils/Logo/Logo';
import useAuth from 'src/hooks/useAuth';
import { HEADER_HEIGHT } from 'src/utils/constants';
import useFeatureKey from 'src/hooks/useFeatureKey';
import { FeatureKey, Role } from 'runbotics-common';
import environment from 'src/utils/environment';
import If from 'src/components/utils/If';
import useRole from 'src/hooks/useRole';
import Account from './Account';
import HowToRun from './HowToRun';
import LangSwitcher from './LangSwitcher';

const PREFIX = 'TopBar';

const classes = {
    root: `${PREFIX}-root`,
    toolbar: `${PREFIX}-toolbar`,
    logo: `${PREFIX}-logo`,
};

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    [`&.${classes.root}`]: {
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        boxShadow: 'none',
        backgroundColor: 'rgb(251, 251, 253)',
        zIndex: theme.zIndex.header,
        maxHeight: HEADER_HEIGHT,
        minHeight: HEADER_HEIGHT,
    },

    [`& .${classes.toolbar}`]: {
        padding: '0 1rem 0 0',
        maxHeight: HEADER_HEIGHT,
        minHeight: HEADER_HEIGHT,
    },

    [`& .${classes.logo}`]: {
        height: '3rem',
    },
}));

interface TopBarProps {
    className?: string;
}

const TopBar: FC<TopBarProps> = ({ className, ...rest }) => {
    const { isAuthenticated } = useAuth();
    const hasBotInstallAccess = useFeatureKey([FeatureKey.BOT_READ]);
    const hasAdminAccess = useRole([Role.ROLE_ADMIN]);

    return (
        <StyledAppBar className={clsx(classes.root, className)} {...rest}>
            <Toolbar className={classes.toolbar}>
                <Hidden mdDown>
                    <RouterLink href="/app">
                        <a>
                            <Logo className={classes.logo} white />
                        </a>
                    </RouterLink>
                </Hidden>
                <If condition={hasAdminAccess}>
                    <Typography variant="h5" sx={{ fontSize: '0.8rem', opacity: '0.5' }}>
                        {environment.version}
                    </Typography>
                </If>
                <Box ml={2} flexGrow={1} />
                <LangSwitcher />
                {isAuthenticated && hasBotInstallAccess && <HowToRun />}
                <Box ml={2}>
                    <Account />
                </Box>
            </Toolbar>
        </StyledAppBar>
    );
};

export default TopBar;
