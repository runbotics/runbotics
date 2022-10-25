import { FeatureKey } from 'runbotics-common';
import { withAuthGuard } from 'src/components/guards/AuthGuard';
import HistoryPage from 'src/views/history/HistoryListView';

export default withAuthGuard(HistoryPage, [FeatureKey.HISTORY_READ]);
