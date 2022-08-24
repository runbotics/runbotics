import CardHeader from '@mui/material/CardHeader';
import React, { VFC } from 'react';
import { CardActionArea, Divider } from '@mui/material';
import { useHistory } from 'react-router-dom';
import Tile, { TileAvatar } from '..';
import { BotCollectionTileProps } from './BotCollectionTile.types';
import BotCollectionTileContent from './BotCollectionTile.content';
import BotCollectionTileFooter from './BotCollectionTile.footer';

const BotCollectionTile: VFC<BotCollectionTileProps> = ({ botCollection, displayMode }) => {
    const history = useHistory();

    const handleRedirect = () => {
        history.push(`/app/bots?collection=${botCollection.id}`);
    };

    return (
        <Tile>
            <CardActionArea onClick={handleRedirect}>
                <CardHeader
                    avatar={<TileAvatar title={botCollection.name} href={`/app/bots/bots/${botCollection.name}`} />}
                    title={botCollection.name}
                    titleTypographyProps={{ variant: 'h5' }}
                />
                <BotCollectionTileContent botCollection={botCollection} />
            </CardActionArea>
            <Divider />
            <BotCollectionTileFooter botCollection={botCollection} displayMode={displayMode} />
        </Tile>
    );
};

export default BotCollectionTile;
