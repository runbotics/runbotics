import { FC, useCallback, useState } from 'react';

import {
    Box,
    DialogContent,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    Typography,
} from '@mui/material';
import { RequestType, UnregisterClientWebhookRequest } from 'runbotics-common';

import * as Yup from 'yup';

import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch } from '#src-app/store';
import { webhookActions } from '#src-app/store/slices/Webhook';
import { registerValidationSchema } from '#src-app/views/webhooks/WebhooksView/WebhookDialog/validationSchema';
import {
    RegistrationPayloadInfo,
    WebhookContent,
    WebhookRegistrationPayloadContainer,
} from '#src-app/views/webhooks/WebhooksView/WebhookDialog/WebhookDialog.styles';
import {
    initialUnregistrationState,
    WebhookUnregisterFormState,
} from '#src-app/views/webhooks/WebhooksView/WebhookDialog/WebhookDialog.utils';

export const WebhookUnregisterForm: FC = () => {
    const { translate } = useTranslations();
    const dispatch = useDispatch();
    const [formValues, setFormValues] =
        useState<WebhookUnregisterFormState>(initialUnregistrationState);
    const [error, setError] = useState<Record<string, string>>({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (e: SelectChangeEvent<RequestType>) => {
        if (formValues.applicationRequestType === e.target.value) {
            return;
        }

        setFormValues((prev) => ({
            ...prev,
            applicationRequestType: e.target.value as RequestType,
        }));

        const newUnregisterForm: UnregisterClientWebhookRequest = {
            applicationRequestType: e.target.value as RequestType,
            applicationUrl: formValues.applicationUrl,
            unregisterPayload: formValues.unregisterPayload,
        };
        dispatch(webhookActions.setUnregistrationForm(newUnregisterForm));
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

        const newUnregisterForm: UnregisterClientWebhookRequest = {
            applicationRequestType: formValues.applicationRequestType,
            applicationUrl: formValues.applicationUrl,
            unregisterPayload: formValues.unregisterPayload,
        };
        dispatch(webhookActions.setUnregistrationForm(newUnregisterForm));
    };

    return (
        <DialogContent>
            <WebhookContent>
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
                <WebhookRegistrationPayloadContainer>
                    <TextField
                        label={translate('Webhooks.Form.UnregisterPayload')}
                        name="registrationPayload"
                        value={formValues.unregisterPayload}
                        onChange={handleChange}
                        error={Boolean(error.unregisterPayload)}
                        helperText={error.unregisterPayload}
                        fullWidth
                        multiline
                        minRows={5}
                        maxRows={5}
                        onBlur={onBlur}
                    />
                </WebhookRegistrationPayloadContainer>
                <RegistrationPayloadInfo>
                    <Typography variant="body2">
                        {translate('Webhooks.Dialog.DeletionWarning')}
                    </Typography>
                </RegistrationPayloadInfo>
            </WebhookContent>
        </DialogContent>
    );
};
