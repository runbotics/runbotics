import { FeatureKey } from 'runbotics-common';

import { withAuthGuard } from '#src-app/components/guards/AuthGuard';
import VariableListView from '#src-app/views/variable/VariableListView';

export default withAuthGuard({ Component: VariableListView, featureKeys: [FeatureKey.GLOBAL_VARIABLE_READ] });
