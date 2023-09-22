import React, { FunctionComponent } from 'react';

import { Typography } from '@mui/material';
import moment from 'moment';

import HighlightText from '#src-app/components/HighlightText';
import useTranslations from '#src-app/hooks/useTranslations';

import { StyledContent, StyledBox } from './ProcessTileContent.styles';
import { ProcessTileContentProps } from './ProcessTileContent.types';

const ProcessTileContent: FunctionComponent<ProcessTileContentProps> = ({
    process, searchValue, refProcessTileContent
}) => {
    const { translate } = useTranslations();

    return (
        <StyledContent ref={refProcessTileContent}>
            <StyledBox>
                <Typography color='textPrimary' variant='h6'>
                    {translate('Component.Tile.Process.Content.LastRun')}
                </Typography>
                <Typography color='textSecondary' variant='body2'>
                    {process.lastRun
                        ? moment(process.lastRun).fromNow()
                        : translate('Component.Tile.Process.Content.LastRun.Placeholder')
                    }
                </Typography>
            </StyledBox>
            <StyledBox>
                <Typography color='textPrimary' variant='h6'>
                    {translate('Component.Tile.Process.Content.Creator')}
                </Typography>
                <Typography color='textSecondary' variant='body2'>
                    <HighlightText
                        text={process.createdBy ? process.createdBy.login : 'RunBotics'}
                        matchingText={searchValue}
                    />
                </Typography>
            </StyledBox>
            <StyledBox>
                <Typography color='textPrimary' variant='h6'>
                    {translate('Component.Tile.Process.Content.Updated')}
                </Typography>
                <Typography color='textSecondary' variant='body2'>
                    {moment(process.updated).fromNow()}
                </Typography>
            </StyledBox>
            <StyledBox>
                <Typography color='textPrimary' variant='h6'>
                    {translate('Component.Tile.Process.Content.Editor')}
                </Typography>
                <Typography color='textSecondary' variant='body2'>
                    {process.editor.login}
                </Typography>
            </StyledBox>
        </StyledContent>
    );
};

export default ProcessTileContent;
