import { FC, useEffect } from 'react';

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
import { register } from '#src-app/store/slices/Auth/Auth.thunks';
import { Language } from '#src-app/translations/translations';
import { SOURCE_PAGE, TRACK_LABEL, USER_TYPE, ENTERED_PAGE, ERROR_REASON } from '#src-app/utils/Mixpanel/types';

import { recordFailedRegistration, recordPageEntrance, recordSuccessfulAuthentication } from '#src-app/utils/Mixpanel/utils';
import { getHttpStatusKeyword } from '#src-app/views/utils/authUtils';

import useRegisterValidationSchema from './useRegisterValidationSchema';

const PREFIX = 'RegisterView';

const classes = {
    root: `${PREFIX}-root`,
    logo: `${PREFIX}-logo`,
    container: `${PREFIX}-container`,
    card: `${PREFIX}-card`,
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

    [`& .${classes.card}`]: {
        padding: theme.spacing(3),
        display: 'flex',
        flexDirection: 'column',
        minHeight: 400,
    },
}));

interface RegisterFormState {
    email: string,
    name: string,
    password: string,
    passwordConfirmation: string,
    submit: null | boolean,
    langKey: Language
}

const initialValues: RegisterFormState = {
    email: '',
    name: '',
    password: '',
    passwordConfirmation: '',
    submit: null,
    langKey: 'en'
};

// eslint-disable-next-line max-lines-per-function
const RegisterPage: FC = () => {
    const { translate } = useTranslations();
    const registerValidationSchema = useRegisterValidationSchema();
    const router = useRouter();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        recordPageEntrance({ enteredPage: ENTERED_PAGE.REGISTER });
    }, []);

    const handleFormSubmit = async (
        values: RegisterFormState,
        { setErrors, setStatus, setSubmitting }
    ) => {
        if (!window.navigator.onLine) {
            setStatus({ success: false });
            setSubmitting(false);
            setErrors({ submit: translate('Register.Error.NoInternet') });
            return;
        }

        const registerValues = router.locale ? { ...values, langKey: router.locale } : values;

        await dispatch(register(registerValues))
            .then(unwrapResult)
            .then(() => {
                setStatus({ success: true });
                setSubmitting(false);
                router.push('/', null, { locale: router.locale });
                enqueueSnackbar(translate('Register.AccountCreated.ActivationNeededMessage'), {
                    variant: 'success',
                    autoHideDuration: 5000,
                });

                recordSuccessfulAuthentication({
                    trackLabel: TRACK_LABEL.SUCCESSFUL_REGISTRATION,
                    identifyBy: values?.email,
                    userType: USER_TYPE.USER,
                    sourcePage: SOURCE_PAGE.REGISTER,
                    email: values?.email,
                });
            })
            .catch((error) => {
                setStatus({ success: false });
                setSubmitting(false);
                const status = getHttpStatusKeyword(error.status);

                const errorKey = `Register.Error.${status}`;

                if (!checkIfKeyExists(errorKey)) {
                    const errorMsg = translate('Register.Error.UnexpectedError');
                    setErrors({ submit: errorMsg });
                    enqueueSnackbar(
                        errorMsg,
                        {
                            variant: 'error',
                            autoHideDuration: 10000,
                        }
                    );
                    recordFailedRegistration({
                        trackLabel: TRACK_LABEL.UNSUCCESSFUL_REGISTRATION,
                        identifyBy: values.email,
                        userType: USER_TYPE.USER,
                        sourcePage: SOURCE_PAGE.REGISTER,
                        reason: ERROR_REASON.UNEXPECTED_ERROR,
                    });

                    return;
                }

                const translatedErrorMsg = translate(errorKey);
                setErrors({ submit: translatedErrorMsg });
                enqueueSnackbar(translatedErrorMsg, {
                    variant: 'error',
                    autoHideDuration: 10000,
                });

                recordFailedRegistration({
                    trackLabel: TRACK_LABEL.UNSUCCESSFUL_REGISTRATION,
                    identifyBy: values.email,
                    userType: USER_TYPE.USER,
                    sourcePage: SOURCE_PAGE.REGISTER,
                    reason: translate(errorKey, { lng: 'en' }),
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
                helperText={touched.email && errors.email}
                label={translate('Register.Form.Fields.Email.Label')}
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
                label={translate('Register.Form.Fields.Password.Label')}
                margin="normal"
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                type="password"
                value={values.password}
                variant="outlined"
            />
            <TextField
                error={Boolean(
                    touched.passwordConfirmation && errors.passwordConfirmation
                )}
                fullWidth
                helperText={
                    touched.passwordConfirmation && errors.passwordConfirmation
                }
                label={translate(
                    'Register.Form.Fields.PasswordConfirmation.Label'
                )}
                margin="normal"
                name="passwordConfirmation"
                onBlur={handleBlur}
                onChange={handleChange}
                type="password"
                value={values.passwordConfirmation}
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
                    {translate('Register.Form.Actions.Register')}
                </Button>
            </Box>
        </form>
    );

    return (
        <StyledPage
            className={classes.root}
            title={translate('Register.Meta.Title')}
        >
            <Container className={classes.container} maxWidth="sm">
                <Box mb={6} display="flex" justifyContent="center">
                    <RouterLink href="/">
                        <Logo height={100} />
                    </RouterLink>
                </Box>
                <Card>
                    <CardContent className={classes.card}>
                        <Box
                            alignItems="center"
                            display="flex"
                            justifyContent="center"
                            mb={0}
                        >
                            <div>
                                <Typography
                                    color="textPrimary"
                                    gutterBottom
                                    variant="h2"
                                >
                                    {translate('Register.SignUp')}
                                </Typography>
                            </div>
                        </Box>
                        <Box flexGrow={1} mt={3}>
                            <Formik
                                initialValues={initialValues}
                                validationSchema={registerValidationSchema}
                                onSubmit={handleFormSubmit}
                            >
                                {renderForm}
                            </Formik>
                        </Box>
                        <Box my={3}>
                            <Divider />
                        </Box>
                        <RouterLink href="/login" passHref legacyBehavior>
                            <Link
                                variant="body2"
                                color="textSecondary"
                                sx={{ textAlign: 'center' }}
                            >
                                {translate('Register.SwitchToLoginMessage')}
                            </Link>
                        </RouterLink>
                    </CardContent>
                </Card>
            </Container>
        </StyledPage>
    );
};

export default RegisterPage;
