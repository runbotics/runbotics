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
import * as Yup from 'yup';

import { useDispatch } from '#src-app/store';
import {
    ICreateClientRegistrationWebhookRequest,
    webhookActions,
} from '#src-app/store/slices/Webhook';
import { WebhookContent } from '#src-app/views/webhooks/WebhooksView/WebhookDialog/WebhookDialog.styles';

export const WebhookRegistrationForm: FC = () => {
    const disptach = useDispatch();
    const [formValues, setFormValues] =
        useState<ICreateClientRegistrationWebhookRequest>({
            name: '',
            applicationUrl: '',
            clientAuthorization: {
                type: WebhookAuthorizationType.NONE,
                data: null,
            },
            registrationPayload: '',
            payload: {
                webhookIdPath: '',
                payloadDataPath: '',
            },
        });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'token' || name === 'username' || name === 'password') {
            setFormValues((prev) => {
                return {
                    ...prev,
                    clientAuthorization: {
                        ...prev.clientAuthorization,
                        data: {
                            ...prev.clientAuthorization.data,
                            [name]: value,
                        },
                    },
                };
            });
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
            setErrors({});
            if (newMethod === WebhookAuthorizationType.NONE) {
                setFormValues((prev) => ({
                    ...prev,
                    clientAuthorization: {
                        type: WebhookAuthorizationType.NONE,
                        data: null,
                    },
                }));
            } else if (newMethod === WebhookAuthorizationType.BASIC) {
                setFormValues((prev) => ({
                    ...prev,
                    clientAuthorization: {
                        type: WebhookAuthorizationType.BASIC,
                        data: {
                            username: '',
                            password: '',
                        },
                    },
                }));
            } else if (newMethod === WebhookAuthorizationType.JWT) {
                setFormValues((prev) => ({
                    ...prev,
                    clientAuthorization: {
                        type: WebhookAuthorizationType.JWT,
                        data: {
                            token: '',
                        },
                    },
                }));
            }
        }
    };

    const onBlur = () => {
        disptach(webhookActions.setRegistrationForm(formValues));
    };

    return (
        <DialogContent>
            <WebhookContent>
                <TextField
                    label="Name *"
                    name="name"
                    value={formValues.name}
                    onChange={handleChange}
                    error={Boolean(errors.name)}
                    helperText={errors.name}
                    fullWidth
                    onBlur={onBlur}
                />

                <TextField
                    label="Application URL *"
                    name="applicationUrl"
                    value={formValues.applicationUrl}
                    onChange={handleChange}
                    error={Boolean(errors.applicationUrl)}
                    helperText={errors.applicationUrl}
                    fullWidth
                    onBlur={onBlur}
                />

                <TextField
                    label="Payload data path *"
                    name="payloadDataPath"
                    value={formValues.payload.payloadDataPath}
                    onChange={handleChange}
                    error={Boolean(errors.payloadDataPath)}
                    helperText={errors.payloadDataPath}
                    fullWidth
                    onBlur={onBlur}
                />

                <TextField
                    label="Webhook ID path *"
                    name="webhookIdPath"
                    value={formValues.payload.webhookIdPath}
                    onChange={handleChange}
                    error={Boolean(errors.webhookNamePath)}
                    helperText={errors.webhookNamePath}
                    fullWidth
                    onBlur={onBlur}
                />

                <TextField
                    label="Registration payload"
                    name="registrationPayload"
                    value={formValues.registrationPayload}
                    onChange={handleChange}
                    error={Boolean(errors.registrationPayload)}
                    helperText={errors.registrationPayload}
                    fullWidth
                    multiline
                    minRows={5}
                    maxRows={5}
                    onBlur={onBlur}
                />

                {/* Authorization Method */}
                <Box>
                    <Typography variant="subtitle1" mb={1}>
                        Authorization method
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
                            NONE
                        </ToggleButton>
                        <ToggleButton value={WebhookAuthorizationType.JWT}>
                            JWT
                        </ToggleButton>
                        <ToggleButton value={WebhookAuthorizationType.BASIC}>
                            BASIC
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                {formValues.clientAuthorization.type ===
                    WebhookAuthorizationType.JWT && (
                    <TextField
                        label="JWT Token *"
                        name="token"
                        value={formValues.clientAuthorization.data.token}
                        onChange={handleChange}
                        error={Boolean(errors.jwtToken)}
                        helperText={errors.jwtToken}
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
                            label="Username *"
                            name="username"
                            value={formValues.clientAuthorization.data.username}
                            onChange={handleChange}
                            error={Boolean(errors.basicUsername)}
                            helperText={errors.basicUsername}
                            fullWidth
                            onBlur={onBlur}
                            autoComplete={'off'}
                        />
                        <TextField
                            label="Password *"
                            name="password"
                            type="password"
                            value={formValues.clientAuthorization.data.password}
                            onChange={handleChange}
                            error={Boolean(errors.basicPassword)}
                            helperText={errors.basicPassword}
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
