import { Box, Typography } from '@mui/material';
import moment from 'moment';
import React, { FunctionComponent } from 'react';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import { red } from '@mui/material/colors';
import useTranslations from 'src/hooks/useTranslations';
import { StyledContent } from './ProcessTile.styles';
import { ProcessTileProps } from './ProcessTile.types';
import { DATE_FORMAT } from '..';

const ProcessTileContent: FunctionComponent<ProcessTileProps> = ({ process }) => {
    const { translate } = useTranslations();

    return (
        <StyledContent>
            <Box>
                <Typography color="textSecondary" variant="body2">
                    {translate('Component.Tile.Process.Content.Created')}
                </Typography>
                <Typography color="textPrimary" variant="h6">
                    {moment(process.created).format(DATE_FORMAT)}
                </Typography>
            </Box>
            <Box>
                <Typography color="textSecondary" variant="body2">
                    {translate('Component.Tile.Process.Content.Creator')}
                </Typography>
                <Typography color="textPrimary" variant="h6">
                    {process.createdBy ? process.createdBy.login : 'RunBotics'}
                </Typography>
            </Box>
            <Box>
                <Typography color="textSecondary" variant="body2">
                    {translate('Component.Tile.Process.Content.Updated')}
                </Typography>
                <Typography color="textPrimary" variant="h6">
                    {moment(process.updated).fromNow()}
                </Typography>
            </Box>
            <Box>
                <Typography color="textSecondary" variant="body2">
                    {translate('Component.Tile.Process.Content.Scheduled')}
                </Typography>
                {
                    process.schedules && process.schedules.length > 0
                        ? <CheckCircleOutlineOutlinedIcon color="success" />
                        : <RemoveCircleOutlineOutlinedIcon sx={{ color: red[500] }} />
                }
            </Box>
        </StyledContent>
    );
};

export default ProcessTileContent;
