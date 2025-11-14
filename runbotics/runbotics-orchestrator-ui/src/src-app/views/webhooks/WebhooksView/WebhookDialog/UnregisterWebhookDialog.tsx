import { FC } from 'react';

import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';

import { useSnackbar } from 'notistack';

import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';
import { webhookActions } from '#src-app/store/slices/Webhook';
import { deleteWebhookEntry, getWebhooks } from '#src-app/store/slices/Webhook/Webhook.thunks';

import { WebhookUnregisterForm } from './WebhookUnregisterForm';

interface UnregisterWebhookDialogProps {
    isOpen: boolean;
}

const UnregisterWebhookDialog: FC<UnregisterWebhookDialogProps> = ({ isOpen }) => {
    const { translate } = useTranslations();
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const formData = useSelector(state => state.webhook.unregisterWebhook);
    const webhookId = useSelector(state => state.webhook.modalWebhookId);

    const onClose = () => {
        dispatch(webhookActions.setIsUnregisterModalOpen(false));
        dispatch(webhookActions.setModalWebhookId(null));
    };

    const onSubmit = async () => {
        if (formData) {
            await dispatch(
                deleteWebhookEntry({
                    resourceId: webhookId,
                    payload: { data: formData }
                })
            )
                .unwrap()
                .then(() => {
                    enqueueSnackbar(translate('Credentials.Collection.Tile.MenuItem.Delete.Success'), { variant: 'success' });
                })
                .catch(error => {
                    if (error.message) {
                        enqueueSnackbar(translate('Webhooks.Dialog.UnregisterWebhook.Error', { message: error.message }), {
                            variant: 'error'
                        });
                    } else {
                        enqueueSnackbar(translate('Webhooks.Dialog.UnregisterWebhook.UnexpectedError'), { variant: 'error' });
                    }
                });
            dispatch(webhookActions.setUnregistrationForm(null));
            dispatch(getWebhooks());
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth={'md'}>
            <DialogTitle>{translate('Webhooks.Dialog.UnregisterWebhook')}</DialogTitle>
            <WebhookUnregisterForm />
            <DialogActions>
                <Button variant={'text'} onClick={onClose} color="inherit">
                    {translate('Webhooks.List.Cancel')}
                </Button>
                <Button
                    variant={'contained'}
                    onClick={() => {
                        onSubmit();
                        onClose();
                    }}
                    color="error"
                >
                    {translate('Webhooks.Dialog.Delete')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UnregisterWebhookDialog;
