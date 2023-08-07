import { FeatureKey } from 'runbotics-common';

import { withAuthGuard } from '#src-app/components/guards/AuthGuard';
import HistoryPage from '#src-app/views/history/HistoryListView';

export default withAuthGuard({ Component: HistoryPage, featureKeys: [FeatureKey.HISTORY_READ] });
