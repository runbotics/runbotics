import React, { FC, useMemo } from 'react';

import Table from '#src-app/components/tables/Table';
import { useWebhookColumns } from '#src-app/components/tables/WebhookTable/Webhook.columns';
import { useSelector } from '#src-app/store';
import UnregisterWebhookDialog from '#src-app/views/webhooks/WebhooksView/WebhookDialog/UnregisterWebhookDialog';

const WebhookTable: FC = () => {
    const columns = useWebhookColumns();
    const { webhooks, loading, search } = useSelector((state) => state.webhook);
    const isUnregisterModalOpen = useSelector((state) => state.webhook.isUnregisterModalOpen);

    const filteredWebhooks = useMemo(() => {
        if (search.length && webhooks) {
            return webhooks.filter((webhook) =>
                webhook.name.toLowerCase().includes(search.toLowerCase())
            );
        }
        return webhooks;
    }, [webhooks, search]);

    return (
        <>
            <Table
                columns={columns}
                data={filteredWebhooks ?? []}
                loading={loading}
            />
            <UnregisterWebhookDialog isOpen={isUnregisterModalOpen}/>
        </>

    );
};

export default WebhookTable;
