import { BotCollectionDto } from 'runbotics-common';

import { Page } from '../../../utils/types/page';

export interface BotCollectionsState {
    loading: boolean;
    botCollections: BotCollectionDto[];
    byPage: Page<BotCollectionDto>
}
