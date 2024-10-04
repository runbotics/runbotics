import React, { FC, useEffect } from 'react';

import { Box, Button, Container, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import Image from 'next/image';
import RouterLink from 'next/link';
import { Role } from 'runbotics-common';
import styled from 'styled-components';

import Page from '#src-app/components/pages/Page';
import Logo from '#src-app/components/utils/Logo';
import useAuth from '#src-app/hooks/useAuth';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch } from '#src-app/store';
import { authActions } from '#src-app/store/slices/Auth';

const PREFIX = 'ErrorView';

const classes = {
    root: `${PREFIX}-root`,
};

const StyledPage = styled(Page)(({ theme }) => ({
    [`&.${classes.root}`]: {
        backgroundColor: theme.palette.background.white,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(3),
        paddingTop: 80,
        paddingBottom: 80,
        position: 'relative',
        overflow: 'hidden',
    },
}));

interface ErrorViewProps {
    errorCode?: number;
    customTitle?: string;
    customMessage?: string;
}

const LogoImage: FC<{ position: 'top' | 'bottom'; }> = ({ position }) => {
    const positionStyles = position === 'top'
        ? { top: '-5vw', maxTop: '-5px' }
        : { bottom: '-5vw', maxBottom: '-5px' };

    return (
        <Box
            position="absolute"
            sx={{
                ...positionStyles,
                width: '100%',
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'center',
            }}
        >
            <Image
                src="/images/runBoticsLogo/logo-blur.svg"
                alt="Runbotics logo"
                width={1}
                height={1}
                style={{
                    maxWidth: '1550px',
                    width: '100%',
                    height: 'auto',
                }}
            />
        </Box>
    );
};

const ErrorView: FC<ErrorViewProps> = ({ errorCode, customTitle, customMessage }) => {
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

    const metaTitle = errorCode ? translate(`Error${errorCode}.Meta.Title` as any) : translate(`CustomError.Meta.Title`);
    const viewTitle = errorCode ? translate(`Error${errorCode}.View.Title` as any) : customTitle;
    const viewMessage = errorCode ? translate(`Error${errorCode}.View.Message` as any) : customMessage;

    return (
        <StyledPage className={classes.root} title={metaTitle}>
            <LogoImage position="top" />
            <Container maxWidth="lg">
                <Box mt={0} display="flex" justifyContent="center">
                    <Logo height={mobileDevice ? 100 : 200} white />
                </Box>
                {!isNaN(errorCode) && (
                    <Typography
                        align="center"
                        variant="h1"
                        color="textPrimary"
                        sx={{
                            height: 150,
                            fontWeight: 800,
                            fontSize: { xs: '64px', sm: '128px' },
                            lineHeight: '150px',
                        }}
                    >
                        {errorCode}
                    </Typography>
                )}
                <Typography
                    align="center"
                    variant={mobileDevice ? 'h4' : 'h1'}
                    color="textPrimary"
                    sx={{ fontWeight: 600, fontSize: mobileDevice ? '24px' : '36px' }}
                >
                    {viewTitle}
                </Typography>
                <Typography
                    align="center"
                    variant="subtitle2"
                    color="textSecondary"
                    sx={{ maxWidth: '670px', margin: '0 auto' }}
                >
                    {viewMessage}
                </Typography>
                <Box mt={6} display="flex" justifyContent="center">
                    <RouterLink href="/" passHref legacyBehavior>
                        <Button color="secondary" variant="contained" size="medium">
                            {translate('Error.View.BackToHome' as any)}
                        </Button>
                    </RouterLink>
                </Box>
            </Container>
            <LogoImage position="bottom" />
        </StyledPage>
    );
};

export default ErrorView;
