import { FeatureKey } from 'runbotics-common';

import { withAuthGuard } from '#src-app/components/guards/AuthGuard';
import ProcessMainView from '#src-app/views/process/ProcessMainView';

export default withAuthGuard(
    ProcessMainView,
    [
        FeatureKey.PROCESS_BUILD_VIEW,
        FeatureKey.PROCESS_RUN_VIEW,
        FeatureKey.PROCESS_CONFIGURE_VIEW,
    ],
    { oneOf: true }
);
