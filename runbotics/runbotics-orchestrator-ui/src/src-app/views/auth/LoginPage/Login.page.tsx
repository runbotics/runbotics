/* eslint-disable max-lines-per-function */
import { FC, useState } from 'react';

import {
    Box,
    Card,
    CardContent,
    Container,
    Divider,
    Link,
    Typography,
    TextField,
    Button,
} from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { Formik } from 'formik';
import RouterLink from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import styled from 'styled-components';

import Page from '#src-app/components/pages/Page';
import Logo from '#src-app/components/utils/Logo/Logo';
import useTranslations, {
    checkIfKeyExists,
} from '#src-app/hooks/useTranslations';

import { useDispatch } from '#src-app/store';
import { login } from '#src-app/store/slices/Auth/Auth.thunks';

import useGuestLogin from './useGuestLogin';
import useLoginValidationSchema from './useLoginValidationSchema';

const PREFIX = 'LoginPage';

const classes = {
    root: `${PREFIX}-root`,
    container: `${PREFIX}-container`,
    content: `${PREFIX}-content`,
    logo: `${PREFIX}-logo`,
};

const StyledPage = styled(Page)(({ theme }) => ({
    [`&.${classes.root}`]: {
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
    },

    [`& .${classes.container}`]: {
        paddingBottom: 80,
        paddingTop: 80,
    },

    [`& .${classes.content}`]: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(3),
        minHeight: 400,
    },
}));

interface LoginFormState {
    email: string,
    password: string,
    submit: null | boolean
}

const initialValues: LoginFormState = {
    email: '',
    password: '',
    submit: null,
};

const LoginPage: FC = () => {
    const { translate } = useTranslations();
    const dispatch = useDispatch();
    const router = useRouter();
    const loginValidationSchema = useLoginValidationSchema();
    const onGuestLogin = useGuestLogin();
    const { enqueueSnackbar } = useSnackbar();
    const [isGuestSubmitting, setGuestSubmitting] = useState(false);

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
            .then(() => {
                setStatus({ success: true });
                setSubmitting(false);
                router.push({pathname:'/app/processes'}, null, { locale:router.locale });
            })
            .catch((error) => {
                setStatus({ success: false });
                setSubmitting(false);
                const status = error.status >= 400 && error.status < 500 ? '4xx' : error.status;
                
                const errorKey = `Login.Error.${status}`;

                if (!checkIfKeyExists(errorKey)) {
                    const customErrorMessage = `${error.message}: ${translate(
                        'Login.Error.UnexpectedError'
                    )}`;
                    setErrors({ submit: customErrorMessage });
                    enqueueSnackbar(customErrorMessage, {
                        variant: 'error',
                        autoHideDuration: 10000,
                    });
                    return;
                }

                const customErrorMessage = `${translate(errorKey)}`;
                setErrors({ submit: customErrorMessage });

                enqueueSnackbar(customErrorMessage, {
                    variant: 'error',
                    autoHideDuration: 10000,
                });
            });
    };

    const renderForm = ({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values,
    }) => (
        <form noValidate onSubmit={handleSubmit}>
            <TextField
                error={Boolean(touched.email && errors.email)}
                fullWidth
                autoFocus
                helperText={touched.email && errors.email}
                label={translate('Login.Form.Email.Label')}
                margin="normal"
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                type="email"
                value={values.email}
                variant="outlined"
            />
            <TextField
                error={Boolean(touched.password && errors.password)}
                fullWidth
                helperText={touched.password && errors.password}
                label={translate('Login.Form.Password.Label')}
                margin="normal"
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                type="password"
                value={values.password}
                variant="outlined"
            />
            <Box mt={2}>
                <Button
                    color="secondary"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                >
                    {translate('Login.Form.Action')}
                </Button>
            </Box>
            <Box mt={2}>
                <Button
                    color="secondary"
                    fullWidth
                    size="large"
                    type="button"
                    variant="outlined"
                    onClick={handleGuestLogin}
                    disabled={isGuestSubmitting}
                >
                    {translate('Login.Guest.Action')}
                </Button>
            </Box>
        </form>
    );

    return (
        <StyledPage className={classes.root} title="Login">
            <Container className={classes.container} maxWidth="sm">
                <Box mb={6} display="flex" justifyContent="center">
                    <RouterLink href="/">
                        <Logo simple height={100} />
                    </RouterLink>
                </Box>
                <Card>
                    <CardContent className={classes.content}>
                        <Box
                            alignItems="center"
                            display="flex"
                            justifyContent="center"
                            mb={0}
                        >
                            <Typography
                                color="textPrimary"
                                gutterBottom
                                variant="h2"
                            >
                                {translate('Login.SignIn')}
                            </Typography>
                        </Box>
                        <Box flexGrow={1} mt={3}>
                            <Formik

                                initialValues={initialValues}
                                validationSchema={loginValidationSchema}
                                onSubmit={handleFormSubmit}
                            >
                                {renderForm}
                            </Formik>
                        </Box>
                        <Box my={3}>
                            <Divider />
                        </Box>
                        <RouterLink href="/register" passHref legacyBehavior>
                            <Link
                                sx={{ textAlign: 'center' }}
                                variant="body2"
                                color="textSecondary"
                            >
                                {translate('Login.SwitchToRegisterMessage')}
                            </Link>
                        </RouterLink>
                    </CardContent>
                </Card>
            </Container>
        </StyledPage>
    );
};

export default LoginPage;
