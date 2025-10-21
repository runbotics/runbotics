import { FC } from 'react';

import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';

import { useDispatch, useSelector } from '#src-app/store';
import { createWebhookEntry } from '#src-app/store/slices/Webhook/Webhook.thunks';
import { WebhookRegistrationForm } from '#src-app/views/webhooks/WebhooksView/WebhookDialog/WebhookRegistrationForm';

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
    const dispatch = useDispatch();
    const formData = useSelector((state) => state.webhook.registerWebhook);

    const onSubmit = async () => {
        if (formData) {
            await dispatch(
                createWebhookEntry({
                    payload: formData,
                })
            );
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth={'md'}>
            <DialogTitle>
                {'Register new Webhook'}
            </DialogTitle>
            <WebhookRegistrationForm />
            <DialogActions>
                <Button variant={'outlined'} onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    variant={'contained'}
                    onClick={() => {
                        onSubmit();
                        onClose();
                    }}
                >
                    Register
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default WebhookDialog;
