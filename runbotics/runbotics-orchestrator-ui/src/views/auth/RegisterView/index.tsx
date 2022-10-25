import React from 'react';
import styled from 'styled-components';
import type { FC } from 'react';
import RouterLink from 'next/link';
import {
    Box,
    Card,
    CardContent,
    Container,
    Divider,
    Link,
    Typography,
    TextField,
    FormHelperText,
    Button,
} from '@mui/material';
import Page from 'src/components/pages/Page';
import Logo from 'src/components/utils/Logo/Logo';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { useDispatch } from 'src/store';
import { register } from 'src/store/slices/Auth/Auth.thunks';
import useTranslations from 'src/hooks/useTranslations';

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

    [`& .${classes.logo}`]: {
        width: '18rem',
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

const RegisterView: FC = () => {
    const { translate } = useTranslations();
    const registrationText = translate('Register.AccountCreated.ActivationNeededMessage');
    const router = useRouter();
    const dispatch = useDispatch();

    const { enqueueSnackbar } = useSnackbar();

    return (
        <StyledPage className={classes.root} title={translate('Register.Meta.Title')}>
            <Container className={classes.container} maxWidth="sm">
                <Box mb={8} display="flex" justifyContent="center">
                    <RouterLink href="/">
                        <Logo className={classes.logo} />
                    </RouterLink>
                </Box>
                <Card>
                    <CardContent className={classes.card}>
                        <Box alignItems="center" display="flex" justifyContent="space-between" mb={0}>
                            <div>
                                <Typography color="textPrimary" gutterBottom variant="h2">
                                    {translate('Register.SignUp')}
                                </Typography>
                            </div>
                        </Box>
                        <Box flexGrow={1} mt={3}>
                            <Formik
                                initialValues={{
                                    email: '',
                                    name: '',
                                    password: '',
                                    passwordConfirmation: '',
                                    submit: null,
                                }}
                                validationSchema={Yup.object().shape({
                                    email: Yup.string()
                                        .email(translate('Register.Form.Validation.Email.Valid'))
                                        .max(255)
                                        .required(translate('Register.Form.Validation.Email.Required')),
                                    password: Yup.string()
                                        .min(7)
                                        .max(255)
                                        .required(translate('Register.Form.Validation.Password.Required')),
                                    passwordConfirmation: Yup.string()
                                        .oneOf(
                                            [Yup.ref('password'), null],
                                            translate('Register.Form.Validation.Password.Match'),
                                        )
                                        .required(translate('Register.Form.Validation.PasswordConfirmation.Required')),
                                })}
                                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                                    try {
                                        await dispatch(register(values));
                                        setStatus({ success: true });
                                        setSubmitting(false);
                                        router.push('/app/processes');
                                        enqueueSnackbar(registrationText, {
                                            variant: 'success',
                                            autoHideDuration: 5000,
                                        });
                                    } catch (err) {
                                        setStatus({ success: false });
                                        setErrors({ submit: err.message });
                                        setSubmitting(false);
                                        enqueueSnackbar(translate('Register.Registration.Error'), {
                                            variant: 'error',
                                        });
                                    }
                                }}
                            >
                                {({
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
                                            error={Boolean(touched.passwordConfirmation && errors.passwordConfirmation)}
                                            fullWidth
                                            helperText={touched.passwordConfirmation && errors.passwordConfirmation}
                                            label={translate('Register.Form.Fields.PasswordConfirmation.Label')}
                                            margin="normal"
                                            name="passwordConfirmation"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            type="password"
                                            value={values.passwordConfirmation}
                                            variant="outlined"
                                        />
                                        {errors.submit && (
                                            <Box mt={3}>
                                                <FormHelperText error>{errors.submit}</FormHelperText>
                                            </Box>
                                        )}
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
                                )}
                            </Formik>
                        </Box>
                        <Box my={3}>
                            <Divider />
                        </Box>
                        <RouterLink href="/login" passHref>
                            <Link variant="body2" color="textSecondary">
                                {translate('Register.SwitchToLoginMessage')}
                            </Link>
                        </RouterLink>
                    </CardContent>
                </Card>
            </Container>
        </StyledPage>
    );
};

export default RegisterView;
