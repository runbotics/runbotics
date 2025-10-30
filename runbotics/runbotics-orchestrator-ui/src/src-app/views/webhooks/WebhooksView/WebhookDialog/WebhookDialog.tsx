import { FC } from 'react';

import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';

import { useDispatch, useSelector } from '#src-app/store';
import { webhookActions } from '#src-app/store/slices/Webhook';
import {
    createWebhookEntry,
    getWebhooks,
} from '#src-app/store/slices/Webhook/Webhook.thunks';
import { WebhookRegistrationForm } from '#src-app/views/webhooks/WebhooksView/WebhookDialog/WebhookRegistrationForm';
import useTranslations from '#src-app/hooks/useTranslations';

interface WebhookDialogProps {
    isOpen: boolean;
    onClose: () => void;
    isEditMode?: boolean;
}

const WebhookDialog: FC<WebhookDialogProps> = ({
    isOpen,
    onClose,
    isEditMode,
}) => {
    const { translate } = useTranslations();
    const dispatch = useDispatch();
    const formData = useSelector((state) => state.webhook.registerWebhook);

    const onSubmit = async () => {
        if (formData) {
            await dispatch(
                createWebhookEntry({
                    payload: formData,
                })
            );
            dispatch(webhookActions.setRegistrationForm(null));
            dispatch(getWebhooks());
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth={'md'}>
            <DialogTitle>
                {translate('Webhooks.List.RegisterNewWebhook')}
            </DialogTitle>
            <WebhookRegistrationForm />
            <DialogActions>
                <Button variant={'outlined'} onClick={onClose}>
                    {translate('Webhooks.List.Cancel')}
                </Button>
                <Button
                    variant={'contained'}
                    onClick={() => {
                        onSubmit();
                        onClose();
                    }}
                >
                    {translate('Webhooks.List.Register')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default WebhookDialog;
