/* eslint-disable max-lines-per-function */
import { FC, useEffect, useState } from 'react';

import {
    Box,
    Card,
    Container,
    Divider,
    useMediaQuery,
} from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import getConfig from 'next/config';
import RouterLink from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';


import Logo from '#src-app/components/utils/Logo/Logo';
import useTranslations, { checkIfKeyExists } from '#src-app/hooks/useTranslations';
import { useDispatch } from '#src-app/store';
import { login } from '#src-app/store/slices/Auth/Auth.thunks';
import { SOURCE_PAGE, TRACK_LABEL, ENTERED_PAGE } from '#src-app/utils/Mixpanel/types';
import { identifyUserType, recordFailedLogin, recordPageEntrance, recordSuccessfulAuthentication } from '#src-app/utils/Mixpanel/utils';
import GuestLoginSection from '#src-app/views/auth/LoginPage/GuestLoginSection';
import { classes, StyledPage } from '#src-app/views/auth/LoginPage/LoginPage.styles';
import useGuestLogin from '#src-app/views/auth/LoginPage/useGuestLogin';
import useLoginValidationSchema from '#src-app/views/auth/LoginPage/useLoginValidationSchema';
import UserLoginSection from '#src-app/views/auth/LoginPage/UserLoginSection';

export interface LoginFormState {
    email: string;
    password: string;
    submit: null | boolean;
}

const initialValues: LoginFormState = {
    email: '',
    password: '',
    submit: null,
};

const LoginPage: FC = () => {
    const { publicRuntimeConfig } = getConfig();
    const isSsoEnabled = publicRuntimeConfig.isSsoEnabled === 'true';
    const { translate } = useTranslations();
    const dispatch = useDispatch();
    const _router = useRouter();
    const loginValidationSchema = useLoginValidationSchema();
    const onGuestLogin = useGuestLogin();
    const { enqueueSnackbar } = useSnackbar();
    const [isGuestSubmitting, setGuestSubmitting] = useState(false);
    const isScreenSM = useMediaQuery('(max-width: 768px)');

    useEffect(() => {
        recordPageEntrance({ enteredPage: ENTERED_PAGE.LOGIN });
    }, []);

    const handleLoginWithMicrosoft = () => {
        window.location.href = '/scheduler/msal/begin';
        return Promise.resolve();
    };

    const handleGuestLogin = () => {
        setGuestSubmitting(true);
        onGuestLogin()
            .catch(() => {
                setGuestSubmitting(false);
            });
    };

    const handleFormSubmit = async (
        values: LoginFormState,
        { setErrors, setStatus, setSubmitting }
    ) => {
        if (!window.navigator.onLine) {
            setStatus({ success: false });
            setSubmitting(false);
            setErrors({ submit: translate('Login.Error.NoInternet') });
            return;
        }
        await dispatch(login(values))
            .then(unwrapResult)
            .then((user) => {
                setStatus({ success: true });
                setSubmitting(false);
                recordSuccessfulAuthentication({
                    identifyBy: user.email,
                    userType: identifyUserType(user.roles),
                    sourcePage: SOURCE_PAGE.LOGIN,
                    email: user.email,
                    trackLabel: TRACK_LABEL.SUCCESSFUL_LOGIN,
                });
            })
            .catch((error) => {
                setStatus({ success: false });
                setSubmitting(false);
                if (error.status === 403 && error.data?.errorKey === 'user_not_activated') {
                    recordFailedLogin({
                        identifyBy: values.email,
                        trackLabel: TRACK_LABEL.UNSUCCESSFUL_LOGIN,
                        sourcePage: SOURCE_PAGE.LOGIN,
                        reason: error.data.title
                    });
                    enqueueSnackbar(translate('Login.Error.UserNotActivated'), {
                        variant: 'error',
                        autoHideDuration: 10000
                    });
                    return;
                }
                if (error.status === 403 && error.data?.errorKey === 'tenant_not_activated') {
                    recordFailedLogin({
                        identifyBy: values.email,
                        trackLabel: TRACK_LABEL.UNSUCCESSFUL_LOGIN,
                        sourcePage: SOURCE_PAGE.LOGIN,
                        reason: error.data.title
                    });
                    enqueueSnackbar(translate('Login.Error.TenantNotActivated'), {
                        variant: 'error',
                        autoHideDuration: 10000
                    });
                    return;
                }
                const status = error.status>= 401 && error.status < 500 ? '4xx' : '5xx';
                const errorKey = `Login.Error.${status}`;

                if (!checkIfKeyExists(errorKey)) {
                    const customErrorMessage = `${error.message ? error.message : error.status}: ${translate('Login.Error.UnexpectedError')}`;
                    setErrors({ submit: customErrorMessage });
                    enqueueSnackbar(customErrorMessage, {
                        variant: 'error',
                        autoHideDuration: 10000
                    });
                    recordFailedLogin({
                        identifyBy: values.email,
                        trackLabel: TRACK_LABEL.UNSUCCESSFUL_LOGIN,
                        sourcePage: SOURCE_PAGE.LOGIN,
                        reason: 'unexpected error'
                    });
                    return;
                }

                const customErrorMessage = `${translate(errorKey)}`;
                setErrors({ submit: customErrorMessage });

                recordFailedLogin({
                    identifyBy: values.email,
                    trackLabel: TRACK_LABEL.UNSUCCESSFUL_LOGIN,
                    sourcePage: SOURCE_PAGE.LOGIN,
                    reason: customErrorMessage
                });
                enqueueSnackbar(customErrorMessage, {
                    variant: 'error',
                    autoHideDuration: 10000
                });
            });
    };

    return (
        <StyledPage className={classes.root} title="Login">
            <Container className={classes.container} maxWidth="lg">
                <Card className={classes.card}>
                    <Box my={3} display="flex" justifyContent="center">
                        <RouterLink href="/">
                            <Logo simple height={100} />
                        </RouterLink>
                    </Box>
                    <Box mb={5} display={isScreenSM ? 'block' : 'flex'}>
                        <UserLoginSection
                            initialValues={initialValues}
                            loginValidationSchema={loginValidationSchema}
                            handleFormSubmit={handleFormSubmit}
                            handleLoginWithMicrosoft={handleLoginWithMicrosoft}
                            isSsoEnabled={isSsoEnabled}
                        />
                        <Box mx={isScreenSM ? 4 : 0}>
                            <Divider
                                orientation={isScreenSM ? 'horizontal' : 'vertical'}
                                sx={{ borderRightWidth: 2, borderBottomWidth: 2 }}
                            />
                        </Box>
                        <GuestLoginSection
                            isGuestSubmitting={isGuestSubmitting}
                            handleGuestLogin={handleGuestLogin}
                        />
                    </Box>
                </Card>
            </Container>
        </StyledPage>
    );
};

export default LoginPage;
