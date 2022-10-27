import { FeatureKey } from 'runbotics-common';

import { withAuthGuard } from 'src/components/guards/AuthGuard';
import BotDetailsView from 'src/views/bot/BotDetailsView';

export default withAuthGuard(BotDetailsView, [FeatureKey.BOT_READ]);
