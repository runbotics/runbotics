import React, { FC, useState, useEffect } from 'react';

import { WebhookOutlined } from '@mui/icons-material';
import { Checkbox, ListItemText, MenuItem, Select, Box, SelectChangeEvent } from '@mui/material';

import { FeatureKey, WebhookProcessTrigger } from 'runbotics-common';

import If from '#src-app/components/utils/If';
import useFeatureKey from '#src-app/hooks/useFeatureKey';
import useProcessConfigurator from '#src-app/hooks/useProcessConfigurator';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';
import { processActions } from '#src-app/store/slices/Process';
import { webhookSelector } from '#src-app/store/slices/Webhook';

import { StyledLabel, Wrapper } from './BotComponent.styles';

interface ProcessWebhookProps {
    selectedWebhooks: WebhookProcessTrigger[];
    processId: number;
}

const ProcessWebhooksComponent: FC<ProcessWebhookProps> = ({ selectedWebhooks, processId }) => {
    const dispatch = useDispatch();
    const { webhooks } = useSelector(webhookSelector);
    const { translate } = useTranslations();
    const hasReadWebhookAccess = useFeatureKey([FeatureKey.PROCESS_WEBHOOKS_VIEW]);
    const hasEditWebhookAccess = useFeatureKey([FeatureKey.PROCESS_WEBHOOKS_EDIT]);
    const canConfigure = useProcessConfigurator();
    const [webhookNames, setWebhookNames] = useState<string[]>([]);

    useEffect(() => {
        if (selectedWebhooks) {
            const selectedWebhookIds = new Set(selectedWebhooks?.map((webhook) => webhook.webhookId));
            const selectedWebhookNames = webhooks?.filter(webhook => selectedWebhookIds?.has(webhook.id)).map(webhook => webhook.name) ?? [];

            setWebhookNames(selectedWebhookNames);
        }
    }, [selectedWebhooks, webhooks]);

    const getWebhooks = () =>
        webhooks && webhooks.length > 0 ?
            Object.values(webhooks).map(webhook => (
                <MenuItem value={webhook.name} key={webhook.name}>
                    <Checkbox checked={webhookNames.includes(webhook.name)} />
                    <ListItemText primary={webhook.name} />
                </MenuItem>
            )) : <MenuItem disabled>
                {translate('Process.Configure.Webhooks.NoWebhooksMessage')}
            </MenuItem>;

    const handleWebhookSelection = async (event: SelectChangeEvent<typeof webhookNames>) => {
        const {
            target: { value }
        } = event;

        const newSelection = typeof value === 'string' ? value.split(',') : value;

        const added = newSelection.find(webhookName => !webhookNames.includes(webhookName));
        const removed = webhookNames.find(webhookName => !newSelection.includes(webhookName));

        if (added) {
            const webhookId = webhooks.find(webhook => webhook.name === added)?.id;

            await dispatch(
                processActions.addWebhook({
                    resourceId: processId,
                    payload: { webhookId: webhookId }
                })
            );
        } else if (removed) {
            const webhookId = webhooks.find(webhook => webhook.name === removed)?.id;
            const webhookProcessTrigerId = selectedWebhooks.find(webhookTrigger => webhookTrigger.webhookId === webhookId);

            await dispatch(
                processActions.deleteWebhook({
                    resourceId: processId,
                    payload: { webhookId: webhookProcessTrigerId.id }
                })
            );
        }
    };

    return (
        <If condition={canConfigure && hasReadWebhookAccess}>
            <Wrapper style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Box style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 8 }}>
                    <WebhookOutlined />
                    <StyledLabel>{`${translate('Process.Configure.Webhooks.Label')}: `}</StyledLabel>
                </Box>
                <Select
                    style={{ height: '1.75rem' }}
                    multiple
                    fullWidth
                    SelectDisplayProps={{
                        style: {
                            paddingBottom: 3,
                            paddingTop: 3
                        }
                    }}
                    value={webhookNames}
                    variant="standard"
                    renderValue={selected =>
                        selected?.length === 0 ? translate('Process.Configure.Webhooks.Placeholder') : selected.join(', ')
                    }
                    onChange={handleWebhookSelection}
                    disabled={!hasEditWebhookAccess}
                    displayEmpty
                >
                    {getWebhooks()}
                </Select>
            </Wrapper>
        </If>
    );
};

export default ProcessWebhooksComponent;

