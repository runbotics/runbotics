import { Box, Typography } from '@mui/material';
import moment from 'moment';
import React, { FunctionComponent } from 'react';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import { red } from '@mui/material/colors';
import useTranslations from 'src/hooks/useTranslations';
import { DATE_FORMAT } from '..';
import { BotCollectionTileProps } from './BotCollectionTile.types';
import { StyledContent } from './BotCollectionTile.styles';

const BotCollectionTileContent: FunctionComponent<BotCollectionTileProps> = ({ botCollection }) => {
    const { translate } = useTranslations();

    return (
        <StyledContent>
            <Box>
                <Typography color="textSecondary" variant="body2">
                    {translate('Component.Tile.BotCollection.Content.Created')}
                </Typography>
                <Typography color="textPrimary" variant="h6">
                    {botCollection.created ? moment(botCollection.created).format(DATE_FORMAT) : ''}
                </Typography>
            </Box>
            <Box>
                <Typography color="textSecondary" variant="body2">
                    {translate('Component.Tile.BotCollection.Content.Creator')}
                </Typography>
                <Typography color="textPrimary" variant="h6">
                    {botCollection.createdBy?.login}
                </Typography>
            </Box>
            <Box>
                <Typography color="textSecondary" variant="body2">
                    {translate('Component.Tile.BotCollection.Content.Updated')}
                </Typography>
                <Typography color="textPrimary" variant="h6">
                    {botCollection.updated ? moment(botCollection.updated).format(DATE_FORMAT) : ''}
                </Typography>
            </Box>
            <Box>
                <Typography color="textSecondary" variant="body2">
                    {translate('Component.Tile.BotCollection.Content.PublicIncluded')}
                </Typography>
                <Typography color="textPrimary" variant="h6">
                    {
                        botCollection.publicBotsIncluded
                            ? <CheckCircleOutlineOutlinedIcon color="success" />
                            : <RemoveCircleOutlineOutlinedIcon sx={{ color: red[500] }} />
                    }
                </Typography>
            </Box>
        </StyledContent>
    );
};

export default BotCollectionTileContent;
