import { FeatureKey } from 'runbotics-common';

import { withAuthGuard } from '#src-app/components/guards/AuthGuard';
import ProcessBrowseView from '#src-app/views/process/ProcessBrowseView';

export default withAuthGuard({ Component: ProcessBrowseView, featureKeys: [FeatureKey.PROCESS_LIST_READ] });
