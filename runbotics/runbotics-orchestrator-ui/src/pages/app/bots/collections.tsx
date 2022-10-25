import { FeatureKey } from 'runbotics-common';
import { withAuthGuard } from 'src/components/guards/AuthGuard';
import BotBrowseView from 'src/views/bot/BotBrowseView';

export default withAuthGuard(BotBrowseView, [FeatureKey.BOT_READ]);
