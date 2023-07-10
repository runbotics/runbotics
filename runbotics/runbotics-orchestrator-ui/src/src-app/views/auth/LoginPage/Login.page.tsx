/* eslint-disable max-lines-per-function */
import { FC, useState, useMemo } from 'react';

import {
    Box,
    Card,
    Container,
    Divider,
    Link,
    Typography,
    TextField,
    Button,
    useMediaQuery,
} from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { Formik } from 'formik';
import RouterLink from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import Logo from '#src-app/components/utils/Logo/Logo';
import useTranslations, { checkIfKeyExists } from '#src-app/hooks/useTranslations';

import { useDispatch } from '#src-app/store';
import { login } from '#src-app/store/slices/Auth/Auth.thunks';

import GuestLoginSection from '#src-app/views/auth/LoginPage/GuestLoginSection';
import { StyledPage } from '#src-app/views/auth/LoginPage/LoginPage.styles';
import useGuestLogin from '#src-app/views/auth/LoginPage/useGuestLogin';
import useLoginValidationSchema from '#src-app/views/auth/LoginPage/useLoginValidationSchema';
import UserLoginSection from '#src-app/views/auth/LoginPage/UserLoginSection';

const PREFIX = 'LoginPage';

export const classes = {
    root: `${PREFIX}-root`,
    container: `${PREFIX}-container`,
    card: `${PREFIX}-card`,
    content: `${PREFIX}-content`,
    logo: `${PREFIX}-logo`,
    option: `${PREFIX}-option`,
};

interface LoginFormState {
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
    const { translate } = useTranslations();
    const dispatch = useDispatch();
    const router = useRouter();
    const loginValidationSchema = useLoginValidationSchema();
    const onGuestLogin = useGuestLogin();
    const { enqueueSnackbar } = useSnackbar();
    const [isGuestSubmitting, setGuestSubmitting] = useState(false);
    const isScreenSM = useMediaQuery('(max-width: 768px)');
    const currentYear = new Date().getFullYear().toLocaleString();

    const handleGuestLogin = () => {
        setGuestSubmitting(true);
        onGuestLogin().catch(() => {
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
                router.push({ pathname: '/app/processes' }, null, {
                    locale: router.locale,
                });
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
        </form>
    );

    return (
        <StyledPage className={classes.root} title="Login">
            <Container className={classes.container} maxWidth="lg">
                <Card className={classes.card}>
                    <Box my={3} display="flex" justifyContent="center">
                        <RouterLink href="/">
                            <Logo simple height={100} />
                        </RouterLink>
                    </Box>
                    <Box display={isScreenSM ? 'block' : 'flex'}>
                        <UserLoginSection>
                            <Formik
                                initialValues={initialValues}
                                validationSchema={loginValidationSchema}
                                onSubmit={handleFormSubmit}
                            >
                                {renderForm}
                            </Formik>
                        </UserLoginSection>
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
                    <Box alignItems="center" display="flex" justifyContent="center" my={4}>
                        <Typography>
                            {'©'}&nbsp;
                            <Link
                                href="https://www.all-for-one.pl/"
                                sx={{ textAlign: 'center' }}
                                variant="body2"
                                color="textSecondary"
                            >
                                {translate('Login.AllRightsReserved.Pt1')}
                            </Link>
                            &nbsp;{currentYear}&nbsp;{translate('Login.AllRightsReserved.Pt2')}
                        </Typography>
                    </Box>
                </Card>
            </Container>
        </StyledPage>
    );
};

export default LoginPage;
