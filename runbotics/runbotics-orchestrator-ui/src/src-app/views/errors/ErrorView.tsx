import React, { FC, useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { Box, Button, Container, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import RouterLink from 'next/link';
import { Role, HttpErrorCodes } from 'runbotics-common';
import styled from 'styled-components';

import Page from '#src-app/components/pages/Page';
import Logo from '#src-app/components/utils/Logo';
import BackgroundLogo from './BackgroundLogo';
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
    title?: string;
    message?: string;
}

const ErrorView: FC<ErrorViewProps> = () => {
    const [errorTitle, setErrorTitle] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [errorCode, setErrorCode] = useState<number | null>(null);
    const theme = useTheme();
    const { user } = useAuth();
    const dispatch = useDispatch();
    const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'));
    const { translate } = useTranslations();
    const router = useRouter();



    useEffect(() => {
        const { code } = router.query;

        if (!isNaN(Number(code)) && Object.values(HttpErrorCodes).includes(Number(code))) {
            setErrorCode(Number(code));
        } else {
            const storedTitle = sessionStorage.getItem('errorTitle');
            const storedMessage = sessionStorage.getItem('errorMessage');

            if (storedTitle && storedMessage) {

            setErrorTitle(storedTitle);
            setErrorMessage(storedMessage);

            sessionStorage.removeItem('errorTitle');
            sessionStorage.removeItem('errorMessage');
            } else {
                router.replace('/404');
            }
        }
    }, [router.query]);

    useEffect(() => {
        if (user?.roles.includes(Role.ROLE_GUEST)) {
            dispatch(authActions.logout());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!errorCode && !errorTitle && !errorMessage) {
        return null;
    }

    const getTranslationKey = (code: HttpErrorCodes, type: 'Meta.Title' | 'View.Title' | 'View.Message') => {
        return `Error${code}.${type}` as const;
    };

    const metaTitle = errorCode ? translate(getTranslationKey(errorCode as HttpErrorCodes, 'Meta.Title')) : translate('CustomError.Meta.Title');
    const viewTitle = errorCode ? translate(getTranslationKey(errorCode as HttpErrorCodes, 'View.Title')) : errorTitle;
    const viewMessage = errorCode ? translate(getTranslationKey(errorCode as HttpErrorCodes, 'View.Message')) : errorMessage;

    return (
        <StyledPage className={classes.root} title={metaTitle}>
            <BackgroundLogo position='top' />
            <Container maxWidth='lg'>
                <Box mt={0} display='flex' justifyContent='center'>
                    <Logo height={mobileDevice ? 100 : 200} white />
                </Box>
                {errorCode && !isNaN(errorCode) && (
                    <Typography
                        align='center'
                        variant='h1'
                        color='textPrimary'
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
                    align='center'
                    variant={mobileDevice ? 'h4' : 'h1'}
                    color='textPrimary'
                    sx={{ fontWeight: 600, fontSize: mobileDevice ? '24px' : '36px' }}
                >
                    {viewTitle}
                </Typography>
                <Typography
                    align='center'
                    variant='subtitle2'
                    color='textSecondary'
                    sx={{ maxWidth: '670px', margin: '0 auto' }}
                >
                    {viewMessage}
                </Typography>
                <Box mt={6} display='flex' justifyContent='center'>
                    <RouterLink href='/' passHref legacyBehavior>
                        <Button color='secondary' variant='contained' size='medium'>
                            {translate('Error.View.BackToHome' as any)}
                        </Button>
                    </RouterLink>
                </Box>
            </Container>
            <BackgroundLogo position='bottom' />
        </StyledPage>
    );
};

export default ErrorView;
