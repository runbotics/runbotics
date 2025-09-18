import { FeatureKey } from 'runbotics-common';

import { withAuthGuard } from '#src-app/components/guards/AuthGuard';
import AIAssistantView from '#src-app/views/AIAssistantView/AIAssistantView';

export default withAuthGuard({
    Component: AIAssistantView,
    featureKeys: [FeatureKey.AI_ASSISTANT_ACCESS],
});
