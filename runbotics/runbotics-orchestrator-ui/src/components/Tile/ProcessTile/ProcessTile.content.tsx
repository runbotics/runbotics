import React, { FunctionComponent } from 'react';

import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import { Box, Typography } from '@mui/material';
import { red } from '@mui/material/colors';
import moment from 'moment';

import If from 'src/components/utils/If';
import useTranslations from 'src/hooks/useTranslations';

import { DATE_FORMAT } from '..';
import { StyledContent } from './ProcessTile.styles';
import { ProcessTileProps } from './ProcessTile.types';

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
                <If
                    condition={process.schedules && process.schedules.length > 0}
                    else={<RemoveCircleOutlineOutlinedIcon sx={{ color: red[500] }} />}
                >
                    <CheckCircleOutlineOutlinedIcon color="success" />
                </If>
            </Box>
        </StyledContent>
    );
};

export default ProcessTileContent;
