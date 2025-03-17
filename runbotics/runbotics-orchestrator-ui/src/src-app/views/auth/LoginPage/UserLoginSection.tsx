import { FC } from 'react';

import MicrosoftIcon from '@mui/icons-material/Microsoft';
import { Box, Button, CardContent, Link, TextField, Typography } from '@mui/material';
import { Formik } from 'formik';
import RouterLink from 'next/link';

import useTranslations from '#src-app/hooks/useTranslations';

import { LoginFormState } from '#src-app/views/auth/LoginPage/Login.page';
import { classes } from '#src-app/views/auth/LoginPage/LoginPage.styles';

import { UseLoginValidationSchema } from './useLoginValidationSchema';

interface Props {
    initialValues: LoginFormState;
    loginValidationSchema: UseLoginValidationSchema;
    handleFormSubmit: (values: LoginFormState, { setErrors, setStatus, setSubmitting }) => Promise<void>;
    isSigningIn: boolean;
    handleLoginWithMicrosoft: () => Promise<void>;
    isSsoEnabled: boolean;
}

const UserLoginSection: FC<Props> = ({
    initialValues,
    loginValidationSchema,
    handleFormSubmit,
    isSigningIn,
    handleLoginWithMicrosoft,
    isSsoEnabled,
}) => {
    const { translate } = useTranslations();

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
        <CardContent className={classes.content}>
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                minHeight={300}
            >
                <Box alignItems="center" display="flex" justifyContent="center" mb={0}>
                    <Typography
                        color="textPrimary"
                        gutterBottom
                        variant="h3"
                        sx={{ fontWeight: 700 }}
                    >
                        {translate('Login.SignIn')}
                    </Typography>
                </Box>
                <Box>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={loginValidationSchema}
                        onSubmit={handleFormSubmit}
                    >
                        {renderForm}
                    </Formik>
                    {isSsoEnabled && <Button
                        color="secondary"
                        fullWidth
                        size="large"
                        variant="contained"
                        sx={{ marginTop: 3 }}
                        disabled={isSigningIn}
                        onClick={handleLoginWithMicrosoft}
                    >
                        <MicrosoftIcon sx={{ marginRight: 1 }} />
                        {translate('Login.SignIn.WithMicrosoft')}
                    </Button>}
                </Box>
            </Box>
            <Box display="flex" justifyContent="center" mt={3}>
                <RouterLink href="/register" passHref legacyBehavior>
                    <Link sx={{ textAlign: 'center' }} variant="body2" color="textSecondary">
                        {translate('Login.SwitchToRegisterMessage')}
                    </Link>
                </RouterLink>
            </Box>
        </CardContent>
    );
};

export default UserLoginSection;
