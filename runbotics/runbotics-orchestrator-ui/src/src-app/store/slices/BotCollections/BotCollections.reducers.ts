import { PayloadAction } from '@reduxjs/toolkit';

import { CollectionsDisplayMode } from '#src-app/views/bot/BotBrowseView/BotBrowseView.utils';

import { BotCollectionsState } from './BotCollections.state';

export const setCollectionDisplayMode = (
    state: BotCollectionsState,
    action: PayloadAction<CollectionsDisplayMode>
) => {
    state.displayMode = action.payload;
};
