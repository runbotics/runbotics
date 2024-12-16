import { BotCollectionDto } from 'runbotics-common';

import { CollectionsDisplayMode } from '../../../views/bot/BotBrowseView/BotBrowseView.utils';

export interface BotCollectionTileProps {
    botCollection: BotCollectionDto;
    displayMode?: CollectionsDisplayMode;
    handleEdit?: (collectionId: string) => void;
}
