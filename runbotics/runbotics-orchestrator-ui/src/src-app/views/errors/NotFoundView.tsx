import React, { FC, useEffect } from 'react';

import { Box, Button, Container, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import RouterLink from 'next/link';
import { Role } from 'runbotics-common';
import styled from 'styled-components';

import Page from '#src-app/components/pages/Page';
import Logo from '#src-app/components/utils/Logo';
import useAuth from '#src-app/hooks/useAuth';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch } from '#src-app/store';
import { authActions } from '#src-app/store/slices/Auth';

const PREFIX = 'NotFoundView';

const classes = {
    root: `${PREFIX}-root`,
};

const StyledPage = styled(Page)(({ theme }) => ({
    [`&.${classes.root}`]: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(3),
        paddingTop: 80,
        paddingBottom: 80,
    },
}));

const NotFoundView: FC = () => {
    const theme = useTheme();
    const { user } = useAuth();
    const dispatch = useDispatch();
    const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'));
    const { translate } = useTranslations();

    useEffect(() => {
        if (user?.roles.includes(Role.ROLE_GUEST)) {
            dispatch(authActions.logout());
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <StyledPage className={classes.root} title={translate('Error404.Meta.Title')}>
            <Container maxWidth="lg">
                <Box mt={0} display="flex" justifyContent="center">
                    <Logo height={150} simple />
                </Box>
                <Typography align="center" variant={mobileDevice ? 'h4' : 'h1'} color="textPrimary">
                    {translate('Error404.View.Title')}
                </Typography>
                <Typography align="center" variant="subtitle2" color="textSecondary">
                    {translate('Error404.View.Message')}
                </Typography>

                <Box mt={6} display="flex" justifyContent="center">
                    <RouterLink href="/" passHref legacyBehavior>
                        <Button color="secondary" variant="outlined">
                            {translate('Error404.View.BackToHome')}
                        </Button>
                    </RouterLink>
                </Box>
            </Container>
        </StyledPage>
    );
};

export default NotFoundView;
