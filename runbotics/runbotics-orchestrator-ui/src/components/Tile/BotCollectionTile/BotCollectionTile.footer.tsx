import React, { VFC } from 'react';
import { BotCollectionTileProps } from './BotCollectionTile.types';
import { Footer } from './BotCollectionTile.styles';
import BotCollectionTileAction from './BotCollectionTile.actions';

const BotCollectionTileFooter: VFC<BotCollectionTileProps> = ({ botCollection, displayMode }) => (
    <Footer>
        <BotCollectionTileAction botCollection={botCollection} displayMode={displayMode} />
    </Footer>
);

export default BotCollectionTileFooter;
