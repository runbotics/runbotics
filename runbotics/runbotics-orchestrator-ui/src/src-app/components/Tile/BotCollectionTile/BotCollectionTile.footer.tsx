import React, { VFC } from 'react';

import BotCollectionTileAction from './BotCollectionTile.actions';
import { Footer } from './BotCollectionTile.styles';
import { BotCollectionTileProps } from './BotCollectionTile.types';

const BotCollectionTileFooter: VFC<BotCollectionTileProps> = ({
    botCollection,
    displayMode,
    handleEdit,
}) => (
    <Footer>
        <BotCollectionTileAction
            botCollection={botCollection}
            displayMode={displayMode}
            handleEdit={handleEdit}
        />
    </Footer>
);

export default BotCollectionTileFooter;
