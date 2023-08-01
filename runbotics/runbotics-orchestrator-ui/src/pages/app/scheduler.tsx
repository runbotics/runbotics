import { FeatureKey } from 'runbotics-common';

import { withAuthGuard } from '#src-app/components/guards/AuthGuard';
import SchedulerPage from '#src-app/views/scheduler/SchedulerView';

export default withAuthGuard({ Component: SchedulerPage, featureKeys: [FeatureKey.SCHEDULER_PAGE_READ] });
