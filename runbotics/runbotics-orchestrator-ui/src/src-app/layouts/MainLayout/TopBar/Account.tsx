import React, { useRef, useState, FC } from 'react';

import { Avatar, Box, Button, Hidden, Menu, MenuItem, Typography, Link } from '@mui/material';
import RouterLink from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import styled from 'styled-components';

import useAuth from '#src-app/hooks/useAuth';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch } from '#src-app/store';
import { authActions } from '#src-app/store/slices/Auth/Auth.slice';
import { logout } from '#src-app/store/slices/Auth/Auth.thunks';


const PREFIX = 'Account';

const classes = {
    avatar: `${PREFIX}-avatar`,
    popover: `${PREFIX}-popover`,
    link: `${PREFIX}-link`,
};

const Root = styled.div(({ theme }) => ({
    [`& .${classes.avatar}`]: {
        height: 32,
        width: 32,
        marginRight: theme.spacing(1),
    },

    [`& .${classes.popover}`]: {
        width: 200,
    },

    [`& .${classes.link}`]: {
        fontWeight: theme.typography.fontWeightMedium,
        '& + &': {
            marginLeft: theme.spacing(2),
        },
        color: 'white',
    },
}));

const Account: FC = () => {
    const router = useRouter();
    const ref = useRef<HTMLDivElement>(null);
    const auth = useAuth();
    const { translate } = useTranslations();
    const { enqueueSnackbar } = useSnackbar();
    const [isOpen, setOpen] = useState(false);
    const dispatch = useDispatch();

    const handleOpen = (): void => {
        setOpen(true);
    };

    const handleClose = (): void => {
        setOpen(false);
    };

    const handleLogout = async () => {
        try {
            handleClose();
            await dispatch(logout())
                .then(() => {
                    router.replace('/');
                })
                .then(() => {
                    dispatch(authActions.updateLogout());
                });

        } catch (err) {
            enqueueSnackbar(translate('Account.UnableToLogout'), {
                variant: 'error',
            });
        }
    };

    if (!auth.isAuthenticated) {
        return (
            <RouterLink href="/" passHref legacyBehavior>
                <Link className={classes.link} underline="none" variant="body2">
                    {translate('Account.SignIn')}
                </Link>
            </RouterLink>
        );
    }

    return (
        <Root>
            <Box
                display="flex"
                alignItems="center"
                gap="1rem"
                padding="0.5rem"
                component={Button}
                onClick={handleOpen}
                textTransform="none"
                ref={ref}
                sx={{ color: (theme) => theme.palette.primary.contrastText }}
            >
                <Hidden lgDown>
                    <Typography variant="h5" sx={{ fontSize: '0.875rem' }}>
                        {auth.user.email}
                    </Typography>
                </Hidden>
                <Avatar alt={translate('Account.User')} className={classes.avatar} src={auth.user.avatar} />
            </Box>
            <Menu
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                keepMounted
                PaperProps={{ className: classes.popover }}
                anchorEl={ref.current}
                open={isOpen}
            >
                <MenuItem onClick={handleLogout}>{translate('Account.Logout')}</MenuItem>
            </Menu>
        </Root>
    );
};

export default Account;
