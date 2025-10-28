import { FC } from 'react';

import GenerateToken from '#src-app/views/webhooks/WebhooksView/WebhookHeader/GenerateToken/GenerateToken';
import {
    WebhookHeaderContainer,
    WebhookHeaderTitle,
} from '#src-app/views/webhooks/WebhooksView/WebhookHeader/WebhookHeader.styles';

const WebhookHeader: FC = () => (
    <WebhookHeaderContainer>
        <WebhookHeaderTitle>Webhooks</WebhookHeaderTitle>
        <GenerateToken />
    </WebhookHeaderContainer>
);

export default WebhookHeader;
