import React, { FC } from 'react';

import Table from '#src-app/components/tables/Table';
import { useWebhookColumns } from '#src-app/components/tables/WebhookTable/Webhook.columns';
import { useSelector } from '#src-app/store';

const WebhookTable: FC = () => {
    const columns = useWebhookColumns();
    const { webhooks, loading } = useSelector((state) => state.webhook);
    return <Table columns={columns} data={webhooks ?? []} loading={loading} />;
};

export default WebhookTable;
