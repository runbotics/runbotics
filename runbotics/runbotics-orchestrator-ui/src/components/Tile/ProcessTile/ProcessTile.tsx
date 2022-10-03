import React from 'react';
import type { VFC } from 'react';
import { useHistory } from 'react-router-dom';
import { Divider, Tooltip, Typography } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import {
    Description,
    ProcessTileContent,
    ProcessTileFooter,
    ProcessTileProps,
    StyledCardActionArea,
} from '.';
import Tile, { TileAvatar } from '..';
import { buildProcessUrl } from './ProcessTile.utils';
import If from 'src/components/utils/If';
import useFeatureKey from 'src/hooks/useFeatureKey';
import { FeatureKey } from 'runbotics-common';
import { ProcessTab } from 'src/utils/process-tab';

const ProcessTile: VFC<ProcessTileProps> = ({ process }) => {
    const history = useHistory();
    const displayDetails = useFeatureKey([FeatureKey.PROCESS_LIST_DETAIL_VIEW]);
    const hasBuildTabAccess = useFeatureKey([FeatureKey.PROCESS_BUILD_VIEW])

    const handleRedirect = () => {
        if (hasBuildTabAccess) {
            history.push(buildProcessUrl(process, ProcessTab.BUILD));
        } else {
            history.push(buildProcessUrl(process, ProcessTab.RUN));
        }
    };

    const fullDescription = (
        <Typography color="white" variant="body2">
            {process.description}
        </Typography>
    );

    return (
        <Tile>
            <StyledCardActionArea onClick={handleRedirect}>
                <CardHeader
                    avatar={<TileAvatar href={buildProcessUrl(process)} title={process.name} />}
                    title={process.name}
                    titleTypographyProps={{ variant: 'h5' }}
                />
                <If condition={displayDetails}>
                    <ProcessTileContent process={process} />
                </If>
                <If condition={!displayDetails && Boolean(process.description)}>
                    <Tooltip title={fullDescription}>
                        <Description color="textSecondary" variant="body2">
                            {process.description}
                        </Description>
                    </Tooltip>
                </If>
            </StyledCardActionArea>
            <If condition={displayDetails}>
                <Divider />
                <ProcessTileFooter process={process} />
            </If>
        </Tile>
    );
};

export default ProcessTile;
