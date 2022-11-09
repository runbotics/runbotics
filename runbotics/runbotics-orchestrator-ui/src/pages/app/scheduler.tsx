import { FeatureKey } from 'runbotics-common';

import { withAuthGuard } from 'src/components/guards/AuthGuard';
import SchedulerPage from 'src/views/scheduler/SchedulerView';

export default withAuthGuard(SchedulerPage, [FeatureKey.SCHEDULER_PAGE_READ]);
