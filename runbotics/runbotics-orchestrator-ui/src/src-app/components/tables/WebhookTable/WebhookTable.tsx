import React, { FC, useMemo } from 'react';

import Table from '#src-app/components/tables/Table';
import { useWebhookColumns } from '#src-app/components/tables/WebhookTable/Webhook.columns';
import { useSelector } from '#src-app/store';

const WebhookTable: FC = () => {
    const columns = useWebhookColumns();
    const { webhooks, loading, search } = useSelector((state) => state.webhook);

    const filteredWebhooks = useMemo(() => {
        if (search.length && webhooks) {
            return webhooks.filter((webhook) =>
                webhook.name.toLowerCase().includes(search.toLowerCase())
            );
        }
        return webhooks;
    }, [webhooks, search]);
    
    return (
        <Table
            columns={columns}
            data={filteredWebhooks ?? []}
            loading={loading}
        />
    );
};

export default WebhookTable;
