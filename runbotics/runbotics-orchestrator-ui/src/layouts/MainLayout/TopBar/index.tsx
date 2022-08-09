import React from 'react';
import styled from 'styled-components';
import type { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import {
    AppBar, Box, Hidden, IconButton, Toolbar, SvgIcon,
} from '@mui/material';
import { Menu as MenuIcon } from 'react-feather';
import Logo from 'src/components/utils/Logo/Logo';
import useAuth from 'src/hooks/useAuth';
import { HEADER_HEIGHT } from 'src/utils/constants';
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
        padding: '0 1rem',
        maxHeight: HEADER_HEIGHT,
        minHeight: HEADER_HEIGHT,
    },

    [`& .${classes.logo}`]: {
        height: '3rem',
    },
}));

interface TopBarProps {
    className?: string;
    onMenuShowToggleChange: () => void;
}

const TopBar: FC<TopBarProps> = ({ className, onMenuShowToggleChange, ...rest }) => {
    const { isAuthenticated } = useAuth();

    return (
        <StyledAppBar className={clsx(classes.root, className)} {...rest}>
            <Toolbar className={classes.toolbar}>
                <IconButton color="inherit" onClick={onMenuShowToggleChange}>
                    <SvgIcon fontSize="small">
                        <MenuIcon />
                    </SvgIcon>
                </IconButton>
                <Hidden mdDown>
                    <RouterLink to="/">
                        <Logo className={classes.logo} white />
                    </RouterLink>
                </Hidden>
                <Box ml={2} flexGrow={1} />
                {/* <LangSwitcher /> */}
                {isAuthenticated && <HowToRun />}
                <Box ml={2}>
                    <Account />
                </Box>
            </Toolbar>
        </StyledAppBar>
    );
};

export default TopBar;
