import type { FC } from 'react';

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
import styled from 'styled-components';

import * as Yup from 'yup';

import Page from '#src-app/components/pages/Page';
import Logo from '#src-app/components/utils/Logo/Logo';
import useTranslations from '#src-app/hooks/useTranslations';


import { useDispatch } from '#src-app/store';
import { login } from '#src-app/store/slices/Auth/Auth.thunks';


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

const LoginPage: FC = () => {
    const { translate } = useTranslations();
    const dispatch = useDispatch();
    const router = useRouter();

    return (
        <StyledPage className={classes.root} title="Login">
            <Container className={classes.container} maxWidth="sm">
                <Box mb={6} display="flex" justifyContent="center">
                    <RouterLink href="/">
                        <Logo
                            simple
                            height={100}
                        />
                    </RouterLink>
                </Box>
                <Card>
                    <CardContent className={classes.content}>
                        <Box alignItems="center" display="flex" justifyContent="center" mb={0}>
                            <Typography color="textPrimary" gutterBottom variant="h2">
                                {translate('Login.SignIn')}
                            </Typography>
                        </Box>
                        <Box flexGrow={1} mt={3}>
                            <Formik
                                initialValues={{
                                    email: '',
                                    password: '',
                                    submit: null,
                                }}
                                validationSchema={Yup.object().shape({
                                    email: Yup.string().max(255).required(translate('Login.Form.Email.Required')),
                                    password: Yup.string().max(255).required(translate('Login.Form.Password.Required')),
                                })}
                                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                                    try {
                                        await dispatch(login(values));
                                        setStatus({ success: true });
                                        setSubmitting(false);
                                        router.push('/app/processes', null, { locale:router.locale });
                                    } catch (err) {
                                        setStatus({ success: false });
                                        setErrors({ submit: err.message });
                                        setSubmitting(false);
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
                                                {translate('Login.Form.Action')}
                                            </Button>
                                        </Box>
                                    </form>
                                )}
                            </Formik>
                        </Box>
                        <Box my={3}>
                            <Divider />
                        </Box>
                        <RouterLink href="/register" passHref legacyBehavior>
                            <Link sx={{ textAlign: 'center' }} variant="body2" color="textSecondary">
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
