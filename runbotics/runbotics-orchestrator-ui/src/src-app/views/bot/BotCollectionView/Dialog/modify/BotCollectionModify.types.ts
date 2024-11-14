import { BotCollectionDto } from 'runbotics-common';

import { CollectionsDisplayMode } from '../../../BotBrowseView/BotBrowseView.utils';

export interface BotCollectionModifyProps {
    botCollection?: BotCollectionDto;
    displayMode: CollectionsDisplayMode
}
