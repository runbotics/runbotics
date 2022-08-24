import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import type { FC } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import {
    Avatar,
    Box,
    Button,
    Hidden,
    Menu,
    MenuItem,
    Typography,
    Link,
} from '@mui/material';
import useAuth from 'src/hooks/useAuth';
import { useDispatch } from 'src/store';
import { logout } from 'src/store/slices/Auth/Auth.thunks';
import useTranslations from 'src/hooks/useTranslations';

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
    const history = useHistory();
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

    const handleLogout = () => {
        try {
            handleClose();
            dispatch(logout());
            history.push('/');
        } catch (err) {
            enqueueSnackbar(translate('Account.UnableToLogout'), {
                variant: 'error',
            });
        }
    };

    if (!auth.isAuthenticated) {
        return (
            <Link className={classes.link} component={RouterLink} to="/login" underline="none" variant="body2">
                {translate('Account.SignIn')}
            </Link>
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
