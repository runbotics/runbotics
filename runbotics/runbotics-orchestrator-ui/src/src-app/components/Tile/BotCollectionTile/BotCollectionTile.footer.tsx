import React, { VFC } from 'react';

import BotCollectionTileAction from './BotCollectionTile.actions';
import { Footer } from './BotCollectionTile.styles';
import { BotCollectionTileProps } from './BotCollectionTile.types';

const BotCollectionTileFooter: VFC<BotCollectionTileProps> = ({ botCollection, displayMode }) => (
    <Footer>
        <BotCollectionTileAction botCollection={botCollection} displayMode={displayMode} />
    </Footer>
);

export default BotCollectionTileFooter;
