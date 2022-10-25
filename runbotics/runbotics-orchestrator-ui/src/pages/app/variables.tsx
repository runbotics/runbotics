import { FeatureKey } from 'runbotics-common';
import { withAuthGuard } from 'src/components/guards/AuthGuard';
import VariableListView from 'src/views/variable/VariableListView';

export default withAuthGuard(VariableListView, [FeatureKey.GLOBAL_VARIABLE_READ]);
