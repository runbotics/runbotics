import React from 'react';
import type { VFC } from 'react';
import { useHistory } from 'react-router-dom';
import {
    Box, Divider, Tooltip, Typography,
} from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import If from 'src/components/utils/If';
import useFeatureKey from 'src/hooks/useFeatureKey';
import { FeatureKey } from 'runbotics-common';
import { ProcessTab } from 'src/utils/process-tab';
import { buildProcessUrl } from './ProcessTile.utils';
import Tile, { TileAvatar } from '..';
import {
    Description,
    ProcessTileContent,
    ProcessTileFooter,
    ProcessTileProps,
    StyledCardActionArea,
} from '.';

const ProcessTile: VFC<ProcessTileProps> = ({ process }) => {
    const history = useHistory();
    const hasProcessDetailsAccess = useFeatureKey([FeatureKey.PROCESS_LIST_DETAIL_VIEW]);
    const hasBuildTabAccess = useFeatureKey([FeatureKey.PROCESS_BUILD_VIEW]);

    const handleRedirect = () => {
        if (hasBuildTabAccess) {
            history.push(buildProcessUrl(process, ProcessTab.BUILD));
        } else {
            history.push(buildProcessUrl(process, ProcessTab.RUN));
        }
    };

    return (
        <Tile>
            <StyledCardActionArea onClick={handleRedirect}>
                <CardHeader
                    avatar={<TileAvatar href={buildProcessUrl(process)} title={process.name} />}
                    title={process.name}
                    titleTypographyProps={{ variant: 'h5' }}
                    sx={{ width: '100%' }}
                />
                <If condition={hasProcessDetailsAccess}>
                    <ProcessTileContent process={process} />
                </If>
                <If condition={!hasProcessDetailsAccess && Boolean(process.description)}>
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        width="100%"
                        height="100%"
                        paddingBottom="1rem"
                    >
                        <Description color="textSecondary" variant="body2">
                            {process.description}
                        </Description>
                    </Box>
                </If>
            </StyledCardActionArea>
            <If condition={hasProcessDetailsAccess}>
                <Divider />
                <ProcessTileFooter process={process} />
            </If>
        </Tile>
    );
};

export default ProcessTile;
