import { IBotCollection } from 'runbotics-common';
import { CollectionsDisplayMode } from '../../../views/bot/BotBrowseView/BotBrowseView.utils';

export interface BotCollectionTileProps {
    botCollection: IBotCollection;
    displayMode?: CollectionsDisplayMode;
}
