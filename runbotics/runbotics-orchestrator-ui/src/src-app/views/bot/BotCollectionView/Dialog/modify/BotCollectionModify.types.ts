import { IBotCollection } from 'runbotics-common';

import { CollectionsDisplayMode } from '../../../BotBrowseView/BotBrowseView.utils';

export interface BotCollectionModifyProps {
    botCollection?: IBotCollection;
    displayMode: CollectionsDisplayMode
}
