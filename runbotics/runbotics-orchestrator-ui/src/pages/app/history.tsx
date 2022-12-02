import { FeatureKey } from 'runbotics-common';

import { withAuthGuard } from '#src-app/components/guards/AuthGuard';
import HistoryPage from '#src-app/views/history/HistoryListView';

export default withAuthGuard(HistoryPage, [FeatureKey.HISTORY_READ]);
