import React from 'react';

import { DeleteOutlined } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { Box } from '@mui/system';
import { WebhookAuthorizationType } from 'runbotics-common';

import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch } from '#src-app/store';
import { webhookActions } from '#src-app/store/slices/Webhook';
import Typography from '#src-landing/components/Typography';

const mapAuthMetod: Record<WebhookAuthorizationType, string> = {
    [WebhookAuthorizationType.BASIC]: 'Basic',
    [WebhookAuthorizationType.NONE]: 'None',
    [WebhookAuthorizationType.JWT]: 'JWT',
};

export const useWebhookColumns = () => {
    const { translate } = useTranslations();
    const dispatch = useDispatch();

    return [
        {
            Header: translate('Component.WebhookTable.Name'),
            accessor: (webhook) => webhook?.name,
            Cell: (row) => <Typography color={'accent'} variant={'body3'} >
                {row.row.original.name}
            </Typography>,
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
            accessor: (webhook) => webhook?.id,
            Cell: ({ row }) => (
                <Box sx={{ display: 'flex' }}>
                    {/* <IconButton>
                        <EditOutlined />
                    </IconButton> */}
                    <IconButton>
                        <DeleteOutlined color={'error'} onClick={() => {
                            dispatch(webhookActions.setIsUnregisterModalOpen(true));
                            dispatch(webhookActions.setModalWebhookId(row.original.id));
                        }
                        }/>
                    </IconButton>
                </Box>
            ),
        },
    ];
};
