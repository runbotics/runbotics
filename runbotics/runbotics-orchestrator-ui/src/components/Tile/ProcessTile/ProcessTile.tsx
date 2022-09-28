import React from 'react';
import type { VFC } from 'react';
import { useHistory } from 'react-router-dom';
import { Divider, Modal, Tooltip, Typography } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import {
    Description,
    ProcessTileContent,
    ProcessTileFooter,
    ProcessTileProps,
    StyledCardActionArea,
    DescriptionWrapper,
} from '.';
import Tile, { TileAvatar } from '..';
import { buildProcessUrl } from './ProcessTile.utils';
import If from 'src/components/utils/If';
import useFeatureKey from 'src/hooks/useFeatureKey';
import { FeatureKey } from 'runbotics-common';
import useTranslations from 'src/hooks/useTranslations';

const ProcessTile: VFC<ProcessTileProps> = ({ process }) => {
    const { translate } = useTranslations();
    const history = useHistory();
    const displayDetails = useFeatureKey([FeatureKey.PROCESS_LIST_DETAIL_VIEW]);

    const handleRedirect = () => {
        history.push(buildProcessUrl(process));
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
                    <DescriptionWrapper>
                        <Typography color="textSecondary" variant="body2">
                            {translate('Component.Tile.Process.Content.Description')}
                        </Typography>
                        <Tooltip title={fullDescription}>
                            <Description color="textPrimary" variant="h6">
                                {process.description}
                            </Description>
                        </Tooltip>
                    </DescriptionWrapper>
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
