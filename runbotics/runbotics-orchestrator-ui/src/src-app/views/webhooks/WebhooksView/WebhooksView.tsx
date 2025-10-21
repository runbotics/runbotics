import React, { FC } from 'react';

import InternalPage from '#src-app/components/pages/InternalPage';
import useTranslations from '#src-app/hooks/useTranslations';
import WebhookHeader from '#src-app/views/webhooks/WebhooksView/WebhookHeader';
import WebhookList from '#src-app/views/webhooks/WebhooksView/WebhookList';
import { useDispatch, useSelector } from '#src-app/store';
import WebhookDialog from '#src-app/views/webhooks/WebhooksView/WebhookDialog';
import { webhookActions } from '#src-app/store/slices/Webhook';

const WebhooksView: FC = () => {
    const dispatch = useDispatch()
    const { translate } = useTranslations();
    const isModalOpen = useSelector((state) => state.webhook.isModalOpen); 
    
    const onModalClose = () => {
        dispatch(webhookActions.setIsModalOpen(false));
    }
    return (
        <>
            <InternalPage
                title={translate('Webhooks.Title')}
                sx={{display: 'flex', flexDirection: 'column', gap: '1rem'}}
            >
                <WebhookHeader />
                <WebhookList/>
                <WebhookDialog isOpen={isModalOpen} onClose={onModalClose} />
            </InternalPage>
        </>
    );
};

export default WebhooksView;
