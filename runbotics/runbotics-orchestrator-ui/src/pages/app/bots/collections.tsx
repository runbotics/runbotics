import { FeatureKey } from 'runbotics-common';

import { withAuthGuard } from '#src-app/components/guards/AuthGuard';
import BotBrowseView from '#src-app/views/bot/BotBrowseView';

export default withAuthGuard(BotBrowseView, [FeatureKey.BOT_READ]);
