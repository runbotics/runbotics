import { FC, useCallback, useState } from 'react';

import { InfoOutlined } from '@mui/icons-material';
import {
    Box,
    DialogContent,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
    Typography,
} from '@mui/material';
import {
    CreateClientRegistrationWebhookRequest,
    RequestType,
    WebhookAuthorizationType,
} from 'runbotics-common';

import * as Yup from 'yup';

import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch } from '#src-app/store';
import { webhookActions } from '#src-app/store/slices/Webhook';
import { registerValidationSchema } from '#src-app/views/webhooks/WebhooksView/WebhookDialog/registerValidationSchema';
import {
    RegistrationPayloadInfo,
    WebhookContent,
    WebhookRegistrationPayloadContainer,
} from '#src-app/views/webhooks/WebhooksView/WebhookDialog/WebhookDialog.styles';
import {
    initialFormState,
    newClientAuthorization,
    WebhookRegistrationFormState,
} from '#src-app/views/webhooks/WebhooksView/WebhookDialog/WebhookDialog.utils';

export const WebhookRegistrationForm: FC = () => {
    const { translate } = useTranslations();
    const dispatch = useDispatch();
    const [formValues, setFormValues] =
        useState<WebhookRegistrationFormState>(initialFormState);
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

    const handleSelectChange = (e: SelectChangeEvent<RequestType>) => {
        if (formValues.applicationRequestType === e.target.value) {
            return;
        }

        setFormValues((prev) => ({
            ...prev,
            applicationRequestType: e.target.value as RequestType,
        }));

        const newRegistrationForm: CreateClientRegistrationWebhookRequest = {
            name: formValues.name,
            applicationRequestType: e.target.value as RequestType,
            applicationUrl: formValues.applicationUrl,
            registrationPayload: formValues.registrationPayload,
            clientAuthorization: {
                type: formValues.type,
                // @ts-expect-error union types don't work well
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
                payloadDataPath: formValues.payloadDataPath,
            },
        };
        dispatch(webhookActions.setRegistrationForm(newRegistrationForm));
    };

    const selectOptions = Object.values(RequestType).map((type) => (
        <MenuItem key={type} value={type}>
            {type}
        </MenuItem>
    ));

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
        const clientAuthData = () => {
            switch (formValues.type) {
                case WebhookAuthorizationType.NONE:
                    return null;
                case WebhookAuthorizationType.JWT:
                    return {
                        token: formValues.token,
                    };
                case WebhookAuthorizationType.BASIC:
                    return {
                        username: formValues.username,
                        password: formValues.password,
                    };
                default:
                    return null;
            }
        };
        
        const newRegistrationForm: CreateClientRegistrationWebhookRequest = {
            name: formValues.name,
            applicationUrl: formValues.applicationUrl,
            applicationRequestType: formValues.applicationRequestType,
            registrationPayload: formValues.registrationPayload,
            // @ts-expect-error union types don't work well
            clientAuthorization: {
                type: formValues.type,
                data: clientAuthData(),
            },
            payload: {
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

                <Box flexDirection={'row'} display={'flex'} gap={'.5rem'}>
                    <Select
                        onChange={handleSelectChange}
                        value={formValues.applicationRequestType}
                        sx={{
                            flex: 2,
                        }}
                    >
                        {selectOptions}
                    </Select>
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
                        sx={{
                            flex: 10,
                        }}
                    />
                </Box>

                <Box
                    flexDirection={'row'}
                    display={'flex'}
                    gap={'.5rem'}
                    alignItems={'center'}
                >
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
                    <Tooltip
                        title={
                            'Provide path as object separated with dot. Example "data.payload.parameters"'
                        }
                    >
                        <InfoOutlined />
                    </Tooltip>
                </Box>

                <WebhookRegistrationPayloadContainer>
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
                    <RegistrationPayloadInfo>
                        {translate('Webhooks.Form.RegistrationPayloadInfo')}
                    </RegistrationPayloadInfo>
                </WebhookRegistrationPayloadContainer>

                <Box>
                    <Typography
                        variant="h5"
                        mb={1}
                        sx={{
                            display: 'flex',
                            gap: '.5rem',
                            alignItems: 'center',
                        }}
                    >
                        {translate('Webhooks.Form.AuthorizationMethod')}
                        <Tooltip
                            title={translate(
                                'Webhooks.Form.Tooltip.AuthorizationMethod'
                            )}
                        >
                            <InfoOutlined fontSize={'small'} />
                        </Tooltip>
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

                {formValues.type === WebhookAuthorizationType.JWT && (
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

                {formValues.type === WebhookAuthorizationType.BASIC && (
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
