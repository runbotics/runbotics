import React from 'react';

import { DeleteOutlined, EditOutlined } from '@mui/icons-material';
import { WebhookAuthorizationType } from 'runbotics-common';

import useTranslations from '#src-app/hooks/useTranslations';
import Typography from '#src-landing/components/Typography';

const mapAuthMetod: Record<WebhookAuthorizationType, string> = {
    [WebhookAuthorizationType.BASIC]: 'Basic',
    [WebhookAuthorizationType.NONE]: 'None',
    [WebhookAuthorizationType.JWT]: 'JWT',
};

export const useWebhookColumns = () => {
    const { translate } = useTranslations();
    return [
        {
            Header: translate('Component.WebhookTable.Name'),
            accessor: (webhook) => webhook?.name,
            Cell: (row) => {
                return <Typography color={'accent'} variant={'body3'} >
                    {row.row.original.name}
                </Typography>;
            },
        },
        {
            Header: translate('Component.WebhookTable.ApplicationUrl'),
            accessor: (webhook) => webhook.applicationURL,
        },
        {
            Header: translate('Component.WebhookTable.PayloadDataPath'),
            accessor: (webhook) => webhook?.payload.payloadDataPath,
        },
        {
            Header: translate('Component.WebhookTable.WebhookIdPath'),
            accessor: (webhook) => webhook?.payload.webhookIdPath,
        },
        {
            Header: translate('Component.WebhookTable.AuthorizationMethod'),
            accessor: (webhook) => webhook?.clientAuthorization.type,
            Cell: ({ row }) =>
                mapAuthMetod[
                    row.original.clientAuthorization
                        .type as WebhookAuthorizationType
                ],
        },
        {
            Header: translate('Component.WebhookTable.Actions'),
            width: '70px',
            Cell: ({ row }) => (
                <div>
                    <EditOutlined />
                    <DeleteOutlined color={'error'} />
                </div>
            ),
        },
    ];
};
