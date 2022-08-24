import React from 'react';
import type { VFC } from 'react';
import { useHistory } from 'react-router-dom';
import { CardActionArea, Divider } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import {
    ProcessTileContent, ProcessTileFooter, ProcessTileProps,
} from '.';
import Tile, { TileAvatar } from '..';
import { buildProcessUrl } from './ProcessTile.utils';

const ProcessTile: VFC<ProcessTileProps> = ({ process }) => {
    const history = useHistory();

    const handleRedirect = () => {
        history.push(buildProcessUrl(process));
    };

    return (
        <Tile>
            <CardActionArea onClick={handleRedirect}>
                <CardHeader
                    avatar={<TileAvatar href={buildProcessUrl(process)} title={process.name} />}
                    title={process.name}
                    titleTypographyProps={{ variant: 'h5' }}
                />
                <ProcessTileContent process={process} />
            </CardActionArea>
            <Divider />
            <ProcessTileFooter process={process} />
        </Tile>
    );
};

export default ProcessTile;
