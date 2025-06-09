import { BotCollectionDto } from 'runbotics-common';

import { CollectionsDisplayMode } from '#src-app/views/bot/BotBrowseView/BotBrowseView.utils';

import { Page } from '../../../utils/types/page';

export interface BotCollectionsState {
    loading: boolean;
    botCollections: BotCollectionDto[];
    byPage: Page<BotCollectionDto>
    displayMode: CollectionsDisplayMode
}
