import { FeatureKey } from 'runbotics-common';

import { withAuthGuard } from '#src-app/components/guards/AuthGuard';
import ActionListView from '#src-app/views/action/ActionListView';

export default withAuthGuard(ActionListView, [FeatureKey.EXTERNAL_ACTION_READ]);
