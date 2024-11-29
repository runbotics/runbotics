import React, { VFC } from 'react';

import { CardActionArea, Divider, CardHeader } from '@mui/material';
import { useRouter } from 'next/router';

import BotCollectionTileContent from './BotCollectionTile.content';
import BotCollectionTileFooter from './BotCollectionTile.footer';
import { BotCollectionTileProps } from './BotCollectionTile.types';
import Tile, { TileAvatar } from '..';

const BotCollectionTile: VFC<BotCollectionTileProps> = ({ botCollection, displayMode, handleEdit }) => {
    const router = useRouter();

    const handleRedirect = () => {
        router.push(`/app/bots?collection=${botCollection.id}`, null, { locale:router.locale });
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
            <BotCollectionTileFooter
                botCollection={botCollection}
                displayMode={displayMode}
                handleEdit={handleEdit}
            />
        </Tile>
    );
};

export default BotCollectionTile;
