import { FeatureKey } from 'runbotics-common';
import { withAuthGuard } from 'src/components/guards/AuthGuard';
import ProcessBrowseView from 'src/views/process/ProcessBrowseView';

export default withAuthGuard(ProcessBrowseView, [FeatureKey.PROCESS_LIST_READ]);
