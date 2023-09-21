import React, { FunctionComponent } from 'react';

import { Box, Typography } from '@mui/material';
import moment from 'moment';

import HighlightText from '#src-app/components/HighlightText';
import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';

import { StyledContent } from './ProcessTileContent.styles';
import { ProcessTileContentProps } from './ProcessTileContent.types';

const ProcessTileContent: FunctionComponent<ProcessTileContentProps> = ({
    process, searchValue
}) => {
    const { translate } = useTranslations();

    return (
        <StyledContent>
            {/* <Box>
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
                    <HighlightText
                        text={process.createdBy ? process.createdBy.login : 'RunBotics'}
                        matchingText={searchValue}
                    />
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
            </Box> */}
            <Box>
                <Typography color='textPrimary' variant='h6'>
                    Last run:
                </Typography>
                <Typography color='textSecondary' variant='body2'>
                    placeholder
                </Typography>
            </Box>
            <Box>
                <Typography color='textPrimary' variant='h6'>
                    Creator:
                </Typography>
                <Typography color='textSecondary' variant='body2'>
                    <HighlightText
                        text={process.createdBy ? process.createdBy.login : 'RunBotics'}
                        matchingText={searchValue}
                    />
                </Typography>
            </Box>
            <Box>
                <Typography color='textPrimary' variant='h6'>
                    Updated:
                </Typography>
                <Typography color='textSecondary' variant='body2'>
                    {moment(process.updated).fromNow()}
                </Typography>
            </Box>
            <Box>
                <Typography color='textPrimary' variant='h6'>
                    Editor:
                </Typography>
                <Typography color='textSecondary' variant='body2'>
                    placeholder
                </Typography>
            </Box>
        </StyledContent>
    );
};

export default ProcessTileContent;
