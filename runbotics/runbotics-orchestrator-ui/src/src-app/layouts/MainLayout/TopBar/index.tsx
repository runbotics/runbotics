import { useEffect, type FC } from 'react';

import {
    AppBar,
    Box,
    Divider,
    Hidden,
    Toolbar,
    Typography,
} from '@mui/material';
import clsx from 'clsx';
import RouterLink from 'next/link';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import { Role } from 'runbotics-common';
import styled from 'styled-components';

import If from '#src-app/components/utils/If';
import Logo from '#src-app/components/utils/Logo/Logo';
import useAuth from '#src-app/hooks/useAuth';
import useRole from '#src-app/hooks/useRole';
import useTranslations from '#src-app/hooks/useTranslations';
import { logout } from '#src-app/store/slices/Auth/Auth.thunks';
import {
    EXECUTION_LIMIT,
    guestsActions,
    guestsSelector,
} from '#src-app/store/slices/Guests';
import { HEADER_HEIGHT } from '#src-app/utils/constants';

import environment from '#src-app/utils/environment';

import LanguageSwitcher from '#src-landing/components/LanguageSwitcher';

import Account from './Account';
import CountdownTimer from './CountdownTimer';
import HowToRun from './HowToRun';
import SubscriptionWarning from './SubscriptionWarning';

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
    const { user } = useAuth();
    const isTenantAdmin = useRole([Role.ROLE_TENANT_ADMIN]);
    const isAdmin = useRole([Role.ROLE_ADMIN]);
    const isGuest = user?.roles.includes(Role.ROLE_GUEST);
    const isOnlyUser = user?.roles.every((role) => role === Role.ROLE_USER);

    const { enqueueSnackbar } = useSnackbar();
    const { translate } = useTranslations();
    const dispatch = useDispatch();
    const { remainingSessionTime, executionsCount } =
        useSelector(guestsSelector);

    useEffect(() => {
        if (isGuest) {
            dispatch(guestsActions.getRemainingSessionTime());
            dispatch(guestsActions.getCurrentGuest());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                    <If condition={isAdmin}>
                        <RouterLink href="/app/tenants">
                            <Logo white />
                        </RouterLink>
                    </If>
                    <If condition={isOnlyUser}>
                        <RouterLink href="/app/assistant">
                            <Logo white />
                        </RouterLink>
                    </If>
                    <If condition={isGuest}>
                        <Logo white />
                    </If>
                    <If condition={!isGuest && !isAdmin && !isOnlyUser}>
                        <RouterLink href="/app/processes/collections">
                            <Logo white />
                        </RouterLink>
                    </If>
                </Hidden>
                <If condition={isTenantAdmin || isAdmin}>
                    <Typography
                        variant="h5"
                        sx={{ fontSize: '0.8rem', opacity: '0.5' }}
                    >
                        {environment.version}
                    </Typography>
                </If>
                <Box ml={2} flexGrow={1} />
                <If condition={isGuest}>
                    <Typography className={classes.status} variant="h5">
                        {translate('Demo.Process.Ran.Pt1')}&nbsp;
                        <span>{`${executionsCount}/${EXECUTION_LIMIT}`}</span>
                        &nbsp;
                        {translate('Demo.Process.Ran.Pt2')}
                    </Typography>
                    <Divider
                        className={classes.divider}
                        orientation="vertical"
                        flexItem
                    />
                    <Typography className={classes.status} variant="h5">
                        {translate('Demo.Session.Timer')}&nbsp;
                        <CountdownTimer
                            remainingTime={remainingSessionTime}
                            callback={handleLogout}
                        />
                    </Typography>
                    <Divider
                        className={classes.divider}
                        orientation="vertical"
                        flexItem
                    />
                </If>
                <If condition={!isGuest}>
                    <SubscriptionWarning />
                </If>
                <LanguageSwitcher />
                {isTenantAdmin && <HowToRun />}
                <Box ml={2}>
                    <Account />
                </Box>
            </Toolbar>
        </StyledAppBar>
    );
};

export default TopBar;
