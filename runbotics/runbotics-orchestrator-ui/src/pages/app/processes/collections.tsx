import { FeatureKey } from 'runbotics-common';

import { withAuthGuard } from '#src-app/components/guards/AuthGuard';
import ProcessCollectionView from '#src-app/views/process/ProcessCollectionView';

export default withAuthGuard({ Component: ProcessCollectionView, featureKeys: [FeatureKey.PROCESS_COLLECTION_READ] });
