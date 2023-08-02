import { FeatureKey } from 'runbotics-common';

import { withAuthGuard } from '#src-app/components/guards/AuthGuard';
import BotBrowseView from '#src-app/views/bot/BotBrowseView';

export default withAuthGuard({ Component: BotBrowseView, featureKeys: [FeatureKey.BOT_READ] });
