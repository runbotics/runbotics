import { useEffect, type FC } from 'react';

import { AppBar, Box, Divider, Hidden, Toolbar, Typography } from '@mui/material';
import clsx from 'clsx';
import RouterLink from 'next/link';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import { FeatureKey, Role } from 'runbotics-common';
import styled from 'styled-components';

import If from '#src-app/components/utils/If';
import Logo from '#src-app/components/utils/Logo/Logo';
import useAuth from '#src-app/hooks/useAuth';
import useFeatureKey from '#src-app/hooks/useFeatureKey';
import useRole from '#src-app/hooks/useRole';
import useTranslations from '#src-app/hooks/useTranslations';
import { logout } from '#src-app/store/slices/Auth/Auth.thunks';
import { EXECUTION_LIMIT, guestsActions, guestsSelector } from '#src-app/store/slices/Guests';
import { HEADER_HEIGHT } from '#src-app/utils/constants';

import environment from '#src-app/utils/environment';

import LanguageSwitcher from '#src-landing/components/LanguageSwitcher';

import Account from './Account';
import CountdownTimer from './CountdownTimer';
import HowToRun from './HowToRun';

const PREFIX = 'TopBar';

const classes = {
    root: `${PREFIX}-root`,
    toolbar: `${PREFIX}-toolbar`,
    status: `${PREFIX}-status`,
    divider: `${PREFIX}-divider`,
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

        [`.${classes.status}`]: {
            fontSize: '0.875rem',

            ['span']: {
                color: theme.palette.secondary.main,
                fontWeight: 700,
            },
        },
    },

    [`.${classes.divider}`]: {
        borderRightWidth: 2,
        margin: '0.85rem',
    },
}));

interface TopBarProps {
    className?: string;
}

const TopBar: FC<TopBarProps> = ({ className, ...rest }) => {
    const { isAuthenticated, user } = useAuth();
    const hasBotInstallAccess = useFeatureKey([FeatureKey.BOT_READ]);
    const hasAdminAccess = useRole([Role.ROLE_ADMIN]);
    const isGuest = user?.roles.includes(Role.ROLE_GUEST);
    const { enqueueSnackbar } = useSnackbar();
    const { translate } = useTranslations();
    const dispatch = useDispatch();
    const { remainingSessionTime, executionsCount } = useSelector(guestsSelector);

    useEffect(() => {
        if (isGuest) {
            dispatch(guestsActions.getRemainingSessionTime());
            dispatch(guestsActions.getGuestExecutionCount({ userId: user.id }));
        }
    }, []);

    const handleLogout = async () => {
        try {
            await dispatch(logout());
            enqueueSnackbar(translate('Account.SessionExpired'), {
                variant: 'warning',
            });
        } catch (err) {
            enqueueSnackbar(translate('Account.UnableToLogout'), {
                variant: 'error',
            });
        }
    };

    return (
        <StyledAppBar className={clsx(classes.root, className)} {...rest}>
            <Toolbar className={classes.toolbar}>
                <Hidden mdDown>
                    {isGuest ? (
                        <Logo white />
                    ) : (
                        <RouterLink href="/app/processes">
                            <Logo white />
                        </RouterLink>
                    )}
                </Hidden>
                <If condition={hasAdminAccess}>
                    <Typography variant="h5" sx={{ fontSize: '0.8rem', opacity: '0.5' }}>
                        {environment.version}
                    </Typography>
                </If>
                <Box ml={2} flexGrow={1} />
                <If condition={isGuest}>
                    <Typography className={classes.status} variant="h5">
                        {translate('Demo.Process.Ran.Pt1')}&nbsp;
                        <span>{`${executionsCount}/${EXECUTION_LIMIT}`}</span>&nbsp;
                        {translate('Demo.Process.Ran.Pt2')}
                    </Typography>
                    <Divider className={classes.divider} orientation="vertical" flexItem />
                    <Typography className={classes.status} variant="h5">
                        {translate('Demo.Session.Timer')}&nbsp;
                        <CountdownTimer
                            remainingTime={remainingSessionTime}
                            callback={handleLogout}
                        />
                    </Typography>
                    <Divider className={classes.divider} orientation="vertical" flexItem />
                </If>
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
