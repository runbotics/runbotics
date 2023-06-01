import { FC } from 'react';

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
import { Formik } from 'formik';
import RouterLink from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import styled from 'styled-components';

import * as Yup from 'yup';

import Page from '#src-app/components/pages/Page';
import Logo from '#src-app/components/utils/Logo/Logo';


import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch } from '#src-app/store';
import { register } from '#src-app/store/slices/Auth/Auth.thunks';

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

// eslint-disable-next-line max-lines-per-function
const RegisterView: FC = () => {
    const { translate } = useTranslations();
    const registrationText = translate('Register.AccountCreated.ActivationNeededMessage');
    const router = useRouter();
    const dispatch = useDispatch();

    const { enqueueSnackbar } = useSnackbar();

    return (
        <StyledPage className={classes.root} title={translate('Register.Meta.Title')}>
            <Container className={classes.container} maxWidth="sm">
                <Box mb={6} display="flex" justifyContent="center">
                    <RouterLink href="/">
                        <Logo height={100} />
                    </RouterLink>
                </Box>
                <Card>
                    <CardContent className={classes.card}>
                        <Box alignItems="center" display="flex" justifyContent="center" mb={0}>
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
                                        router.push('/app/processes', null, { locale:router.locale });
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
                                {
                                    ({
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
                        <RouterLink href="/login" passHref legacyBehavior>
                            <Link variant="body2" color="textSecondary" sx={{ textAlign: 'center' }}>
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
