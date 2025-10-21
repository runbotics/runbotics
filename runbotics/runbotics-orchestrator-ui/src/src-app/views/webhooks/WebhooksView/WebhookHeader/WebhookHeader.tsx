import { FC } from 'react';

import { Button } from '@mui/material';

import {
    WebhookHeaderContainer,
    WebhookHeaderTitle,
    WebhookHeaderTokenContainer, WebhookHeaderTokenText,
} from '#src-app/views/webhooks/WebhooksView/WebhookHeader/WebhookHeader.styles';

const WebhookHeader: FC = () => (
    <WebhookHeaderContainer>
        <WebhookHeaderTitle>Webhooks</WebhookHeaderTitle>
        <WebhookHeaderTokenContainer>
            <Button variant={'outlined'} disabled>GENERATE TOKEN</Button>
            <WebhookHeaderTokenText>{'click to generate one time token'} (Work in progress...)</WebhookHeaderTokenText>
        </WebhookHeaderTokenContainer>
    </WebhookHeaderContainer>
);

export default WebhookHeader;
