import type { VFC } from 'react';

import { Box, Divider, CardHeader } from '@mui/material';

import { useRouter } from 'next/router';
import { FeatureKey } from 'runbotics-common';

import If from '#src-app/components/utils/If';

import useFeatureKey from '#src-app/hooks/useFeatureKey';

import { ProcessTab } from '#src-app/utils/process-tab';

import { Description, ProcessTileContent, ProcessTileFooter, ProcessTileProps, StyledCardActionArea } from '.';

import Tile, { TileAvatar } from '..';

import { buildProcessUrl } from './ProcessTile.utils';




const ProcessTile: VFC<ProcessTileProps> = ({ process }) => {
    const router = useRouter();
    const hasProcessDetailsAccess = useFeatureKey([FeatureKey.PROCESS_LIST_DETAIL_VIEW]);
    const hasBuildTabAccess = useFeatureKey([FeatureKey.PROCESS_BUILD_VIEW]);

    const handleRedirect = () => {
        if (hasBuildTabAccess) router.push(buildProcessUrl(process, ProcessTab.BUILD));
        else router.push(buildProcessUrl(process, ProcessTab.RUN));
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
