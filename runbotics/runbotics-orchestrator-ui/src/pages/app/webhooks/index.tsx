import { FeatureKey } from 'runbotics-common';

import { withAuthGuard } from '#src-app/components/guards/AuthGuard';
import WebhooksView from '#src-app/views/webhooks/WebhooksView';

export default withAuthGuard({
    Component: WebhooksView,
    featureKeys: [FeatureKey.WEBHOOKS_PAGE_READ],
});
