import type { FC } from 'react';

import { AppBar, Box, Hidden, Toolbar, Typography } from '@mui/material';
import clsx from 'clsx';
import RouterLink from 'next/link';
import { FeatureKey, Role } from 'runbotics-common';
import styled from 'styled-components';



import If from '#src-app/components/utils/If';
import Logo from '#src-app/components/utils/Logo/Logo';
import useAuth from '#src-app/hooks/useAuth';
import useFeatureKey from '#src-app/hooks/useFeatureKey';
import useRole from '#src-app/hooks/useRole';
import { HEADER_HEIGHT } from '#src-app/utils/constants';



import environment from '#src-app/utils/environment';

import LanguageSwitcher from '#src-landing/components/LanguageSwitcher';

import Account from './Account';
import HowToRun from './HowToRun';



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
                    <RouterLink href="/app/processes">
                        <Logo white />
                    </RouterLink>
                </Hidden>
                <If condition={hasAdminAccess}>
                    <Typography variant="h5" sx={{ fontSize: '0.8rem', opacity: '0.5' }}>
                        {environment.version}
                    </Typography>
                </If>
                <Box ml={2} flexGrow={1} />
                <LanguageSwitcher />
                {isAuthenticated && hasBotInstallAccess && <HowToRun />}
                <Box ml={2}>
                    <Account />
                </Box>
            </Toolbar>
        </StyledAppBar>
    );
};

export default TopBar;
