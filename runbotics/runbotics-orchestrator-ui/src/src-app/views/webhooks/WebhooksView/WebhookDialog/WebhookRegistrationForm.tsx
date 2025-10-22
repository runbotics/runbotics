import { FC, useState } from 'react';

import {
    Box,
    DialogContent,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from '@mui/material';
import { WebhookAuthorizationType } from 'runbotics-common';

import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch } from '#src-app/store';
import {
    CreateClientRegistrationWebhookRequest,
    webhookActions,
} from '#src-app/store/slices/Webhook';
import { WebhookContent } from '#src-app/views/webhooks/WebhooksView/WebhookDialog/WebhookDialog.styles';
import {
    initialFormState,
    newClientAuthorization,
} from '#src-app/views/webhooks/WebhooksView/WebhookDialog/WebhookDialog.utils';

export const WebhookRegistrationForm: FC = () => {
    const {translate} = useTranslations();
    const dispatch = useDispatch();
    const [formValues, setFormValues] =
        useState<CreateClientRegistrationWebhookRequest>(initialFormState);
    const [error, setError] = useState<Record<string, string>>({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'token' || name === 'username' || name === 'password') {
            // @ts-expect-error union types doesn't work well with nested objects checks
            setFormValues((prev) => ({
                ...prev,
                clientAuthorization: {
                    ...prev.clientAuthorization,
                    data: {
                        ...prev.clientAuthorization.data,
                        [name]: value,
                    },
                },
            }));
        } else if (name === 'payloadDataPath' || name === 'webhookIdPath') {
            setFormValues((prev) => ({
                ...prev,
                payload: {
                    ...prev.payload,
                    [name]: value,
                },
            }));
        } else {
            setFormValues((prev) => ({ ...prev, [name]: value }));
        }
    };



    const handleAuthChange = (_, newMethod) => {
        if (newMethod) {
            setError({});

            setFormValues((prevState) => ({
                ...prevState,
                clientAuthorization: newClientAuthorization(newMethod),
            }));
        }
    };

    const onBlur = () => {
        dispatch(webhookActions.setRegistrationForm(formValues));
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
                />

                <TextField
                    label={translate('Webhooks.Form.PayloadDataPath')}
                    name="payloadDataPath"
                    value={formValues.payload.payloadDataPath}
                    onChange={handleChange}
                    error={Boolean(error.payloadDataPath)}
                    helperText={error.payloadDataPath}
                    fullWidth
                    onBlur={onBlur}
                />

                <TextField
                    label={translate('Webhooks.Form.WebhookIdPath')}
                    name="webhookIdPath"
                    value={formValues.payload.webhookIdPath}
                    onChange={handleChange}
                    error={Boolean(error.webhookNamePath)}
                    helperText={error.webhookNamePath}
                    fullWidth
                    onBlur={onBlur}
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

                {/* Authorization Method */}
                <Box>
                    <Typography variant="subtitle1" mb={1}>
                        {translate('Webhooks.Form.AuthorizationMethod')}
                    </Typography>
                    <ToggleButtonGroup
                        color="primary"
                        value={formValues.clientAuthorization.type}
                        exclusive
                        onChange={handleAuthChange}
                        fullWidth
                        onBlur={onBlur}
                    >
                        <ToggleButton value={WebhookAuthorizationType.NONE}>
                            {WebhookAuthorizationType.NONE.toUpperCase()}
                        </ToggleButton>
                        <ToggleButton value={WebhookAuthorizationType.JWT}>
                            {WebhookAuthorizationType.JWT.toUpperCase()}
                        </ToggleButton>
                        <ToggleButton value={WebhookAuthorizationType.BASIC}>
                            {WebhookAuthorizationType.BASIC.toUpperCase()}
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                {formValues.clientAuthorization.type ===
                    WebhookAuthorizationType.JWT && (
                    <TextField
                        label={translate('Webhooks.Form.JwtToken')}
                        name="token"
                        value={formValues.clientAuthorization.data.token}
                        onChange={handleChange}
                        error={Boolean(error.jwtToken)}
                        helperText={error.jwtToken}
                        fullWidth
                        onBlur={onBlur}
                        autoComplete={'off'}
                        multiline
                        minRows={3}
                    />
                )}

                {formValues.clientAuthorization.type ===
                    WebhookAuthorizationType.BASIC && (
                    <>
                        <TextField
                            label={translate('Webhooks.Form.Username')}
                            name="username"
                            value={formValues.clientAuthorization.data.username}
                            onChange={handleChange}
                            error={Boolean(error.basicUsername)}
                            helperText={error.basicUsername}
                            fullWidth
                            onBlur={onBlur}
                            autoComplete={'off'}
                        />
                        <TextField
                            label={translate('Webhooks.Form.Password')}
                            name="password"
                            type="password"
                            value={formValues.clientAuthorization.data.password}
                            onChange={handleChange}
                            error={Boolean(error.basicPassword)}
                            helperText={error.basicPassword}
                            fullWidth
                            onBlur={onBlur}
                            autoComplete={'off'}
                        />
                    </>
                )}
            </WebhookContent>
        </DialogContent>
    );
};
