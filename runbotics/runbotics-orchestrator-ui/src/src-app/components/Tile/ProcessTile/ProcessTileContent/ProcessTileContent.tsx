import React, { FunctionComponent } from 'react';

import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import { Box, Typography } from '@mui/material';
import { red } from '@mui/material/colors';
import moment from 'moment';

import HighlightText from '#src-app/components/HighlightText';
import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';

import { StyledContent } from './ProcessTileContent.styles';
import { ProcessTileContentProps } from './ProcessTileContent.types';
import { DATE_FORMAT } from '../../Tile.utils';

const ProcessTileContent: FunctionComponent<ProcessTileContentProps> = ({
    process, highlightTextStyle, searchValue
}) => {
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
                    <HighlightText
                        text={process.createdBy ? process.createdBy.login : 'RunBotics'}
                        matchingText={searchValue}
                        matchStyle={highlightTextStyle}
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
            </Box>
        </StyledContent>
    );
};

export default ProcessTileContent;
