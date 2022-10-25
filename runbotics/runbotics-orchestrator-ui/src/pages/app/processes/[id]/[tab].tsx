import { FeatureKey } from 'runbotics-common';
import { withAuthGuard } from 'src/components/guards/AuthGuard';
import ProcessMainView from 'src/views/process/ProcessMainView';

export default withAuthGuard(ProcessMainView, [FeatureKey.PROCESS_READ]);
