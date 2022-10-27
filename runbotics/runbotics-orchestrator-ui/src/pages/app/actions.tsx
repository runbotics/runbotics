import { FeatureKey } from 'runbotics-common';

import { withAuthGuard } from 'src/components/guards/AuthGuard';
import ActionListView from 'src/views/action/ActionListView';

export default withAuthGuard(ActionListView, [FeatureKey.EXTERNAL_ACTION_READ]);
