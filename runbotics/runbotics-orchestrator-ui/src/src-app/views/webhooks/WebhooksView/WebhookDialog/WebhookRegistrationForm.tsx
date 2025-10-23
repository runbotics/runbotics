import { FC, useCallback, useState } from 'react';

import {
    Box,
    DialogContent,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from '@mui/material';
import { WebhookAuthorizationType } from 'runbotics-common';

import * as Yup from 'yup';

import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch } from '#src-app/store';
import {
    CreateClientRegistrationWebhookRequest,
    webhookActions,
} from '#src-app/store/slices/Webhook';
import { registerValidationSchema } from '#src-app/views/webhooks/WebhooksView/WebhookDialog/registerValidationSchema';
import { WebhookContent } from '#src-app/views/webhooks/WebhooksView/WebhookDialog/WebhookDialog.styles';
import {
    initialFormState,
    newClientAuthorization,
    WebhookRegistrationForm,
} from '#src-app/views/webhooks/WebhooksView/WebhookDialog/WebhookDialog.utils';

export const WebhookRegistrationForm: FC = () => {
    const { translate } = useTranslations();
    const dispatch = useDispatch();
    const [formValues, setFormValues] =
        useState<WebhookRegistrationForm>(initialFormState);
    const [error, setError] = useState<Record<string, string>>({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleAuthChange = (_, newMethod) => {
        if (newMethod) {
            setFormValues((prevState) => ({
                ...prevState,
                ...newClientAuthorization(newMethod),
            }));
        }
    };

    const validateForm = useCallback(async () => {
        try {
            await registerValidationSchema.validate(formValues, {
                abortEarly: false,
            });
        } catch (err) {
            if (err instanceof Yup.ValidationError) {
                const newErrors = {};
                err.inner.forEach((e) => {
                    newErrors[e.path] = e.message;
                });
                if (err.path && !newErrors[err.path]) {
                    newErrors[err.path] = err.message;
                }
                setError(newErrors);
            }
        }
    }, [formValues]);

    const onBlur = async () => {
        await validateForm();
        const newRegistrationForm: CreateClientRegistrationWebhookRequest = {
            name: formValues.name,
            applicationUrl: formValues.applicationUrl,
            registrationPayload: formValues.registrationPayload,
            clientAuthorization: {
                type: formValues.type,
                // @ts-expect-error union types doesn't work well
                data:
                // eslint-disable-next-line no-nested-ternary
                    formValues.type === WebhookAuthorizationType.JWT
                        ? formValues.token
                        : formValues.type === WebhookAuthorizationType.BASIC
                            ? {
                                username: formValues.username,
                                password: formValues.password,
                            }
                            : null,
            },
            payload: {
                webhookIdPath: formValues.webhookIdPath,
                payloadDataPath: formValues.payloadDataPath,
            },
        };
        dispatch(webhookActions.setRegistrationForm(newRegistrationForm));
    };

    return (
        <DialogContent>
            <WebhookContent>
                <TextField
                    label={translate('Webhooks.Form.Name')}
                    name="name"
                    value={formValues.name}
                    onChange={handleChange}
                    error={Boolean(error.name)}
                    helperText={error.name}
                    fullWidth
                    onBlur={onBlur}
                    required
                />

                <TextField
                    label={translate('Webhooks.Form.ApplicationUrl')}
                    name="applicationUrl"
                    value={formValues.applicationUrl}
                    onChange={handleChange}
                    error={Boolean(error.applicationUrl)}
                    helperText={error.applicationUrl}
                    fullWidth
                    onBlur={onBlur}
                    required
                />

                <TextField
                    label={translate('Webhooks.Form.PayloadDataPath')}
                    name="payloadDataPath"
                    value={formValues.payloadDataPath}
                    onChange={handleChange}
                    error={Boolean(error.payloadDataPath)}
                    helperText={error.payloadDataPath}
                    fullWidth
                    onBlur={onBlur}
                    required
                />

                <TextField
                    label={translate('Webhooks.Form.WebhookIdPath')}
                    name="webhookIdPath"
                    value={formValues.webhookIdPath}
                    onChange={handleChange}
                    error={Boolean(error.webhookNamePath)}
                    helperText={error.webhookNamePath}
                    fullWidth
                    onBlur={onBlur}
                    required
                />

                <TextField
                    label={translate('Webhooks.Form.RegistrationPayload')}
                    name="registrationPayload"
                    value={formValues.registrationPayload}
                    onChange={handleChange}
                    error={Boolean(error.registrationPayload)}
                    helperText={error.registrationPayload}
                    fullWidth
                    multiline
                    minRows={5}
                    maxRows={5}
                    onBlur={onBlur}
                />

                <Box>
                    <Typography variant="subtitle1" mb={1}>
                        {translate('Webhooks.Form.AuthorizationMethod')}
                    </Typography>
                    <ToggleButtonGroup
                        color="primary"
                        value={formValues.type}
                        exclusive
                        onChange={handleAuthChange}
                        fullWidth
                        onBlur={onBlur}
                    >
                        <ToggleButton
                            name={'type'}
                            value={WebhookAuthorizationType.NONE}
                        >
                            {WebhookAuthorizationType.NONE.toUpperCase()}
                        </ToggleButton>
                        <ToggleButton
                            name={'type'}
                            value={WebhookAuthorizationType.JWT}
                        >
                            {WebhookAuthorizationType.JWT.toUpperCase()}
                        </ToggleButton>
                        <ToggleButton
                            name={'type'}
                            value={WebhookAuthorizationType.BASIC}
                        >
                            {WebhookAuthorizationType.BASIC.toUpperCase()}
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                {formValues.type ===
                    WebhookAuthorizationType.JWT && (
                    <TextField
                        label={translate('Webhooks.Form.JwtToken')}
                        name="token"
                        value={formValues.token}
                        onChange={handleChange}
                        error={Boolean(error.token)}
                        helperText={error.token}
                        fullWidth
                        onBlur={onBlur}
                        autoComplete={'off'}
                        multiline
                        minRows={3}
                        required
                    />
                )}

                {formValues.type ===
                    WebhookAuthorizationType.BASIC && (
                    <>
                        <TextField
                            label={translate('Webhooks.Form.Username')}
                            name="username"
                            value={formValues.username}
                            onChange={handleChange}
                            error={Boolean(error.username)}
                            helperText={error.username}
                            fullWidth
                            onBlur={onBlur}
                            autoComplete={'off'}
                            required
                        />
                        <TextField
                            label={translate('Webhooks.Form.Password')}
                            name="password"
                            type="password"
                            value={formValues.password}
                            onChange={handleChange}
                            error={Boolean(error.password)}
                            helperText={error.password}
                            fullWidth
                            onBlur={onBlur}
                            autoComplete={'off'}
                            required
                        />
                    </>
                )}
            </WebhookContent>
        </DialogContent>
    );
};
