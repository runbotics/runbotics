import { FeatureKey } from 'runbotics-common';

import { withAuthGuard } from '#src-app/components/guards/AuthGuard';
import ProcessMainView from '#src-app/views/process/ProcessMainView';

export default withAuthGuard(ProcessMainView, [FeatureKey.PROCESS_LIST_READ]);
