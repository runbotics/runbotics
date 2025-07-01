import { useEffect } from 'react';

import { Box, Button, Card, CircularProgress, Container, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import { MsalLoginError } from 'runbotics-common';

import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch } from '#src-app/store';
import { loginWithMsalCookie } from '#src-app/store/slices/Auth/Auth.thunks';

const MsalCallbackPage = () => {
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const { translate } = useTranslations();
    const dispatch = useDispatch();

    const getMsalErrorMessage = (errorParam: string | undefined) => {
        switch (errorParam) {
            case MsalLoginError.BAD_EMAIL:
                return translate('Login.Error.Msal.BadEmail');
            case MsalLoginError.BAD_COOKIE:
                return translate('Login.Error.Msal.BadCookie');
            case MsalLoginError.MSAL_TOKEN_EXCHANGE_ERROR:
                return translate('Login.Error.Msal.TokenExchangeError');
            case MsalLoginError.TOKEN_ISSUE_FILED:
                return translate('Login.Error.Msal.TokenIssueFiled');
            default:
                return translate('Login.Error.UnexpectedError');
        }
    };

    useEffect(() => {
        const errorParam = router.query.error as string | undefined;
        if (errorParam) {
            const errorMessage = getMsalErrorMessage(errorParam);
            setTimeout(() => {
                // Without empty set timeout enqueueSnackbar disappears instantly
                // Once this bug is fixed, this bypass can be removed.
                enqueueSnackbar(errorMessage, {
                    variant: 'error',
                    autoHideDuration: 10000,
                });
            }, 0);
            router.replace('/login');
            return;
        }
        dispatch(loginWithMsalCookie())
            .then(() => {
                router.replace('/');
            })
            .catch((error) => {
                const errorMessage = getMsalErrorMessage(error);
                enqueueSnackbar(errorMessage, {
                    variant: 'error',
                    autoHideDuration: 10000,
                });
                router.replace('/login');
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Container maxWidth="sm">
            <Card sx={{ mt: 8, p: 4, textAlign: 'center' }}>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <CircularProgress />
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        {'Signing in with Microsoft... You should be redirected soon.'}
                    </Typography>
                    <Box mt={2}>
                        <Button
                            variant="text"
                            color="primary"
                            onClick={() => router.replace('/login')}
                        >
                            {'If that didn\'t happen, go to Login page and try again.'}
                        </Button>
                    </Box>
                </Box>
            </Card>
        </Container>
    );
};

export default MsalCallbackPage;
