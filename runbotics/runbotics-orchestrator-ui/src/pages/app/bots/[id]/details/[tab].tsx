import { FeatureKey } from 'runbotics-common';

import { withAuthGuard } from '#src-app/components/guards/AuthGuard';
import BotDetailsView from '#src-app/views/bot/BotDetailsView';

export default withAuthGuard(BotDetailsView, [FeatureKey.BOT_READ]);
