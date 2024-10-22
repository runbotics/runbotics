import React, { forwardRef } from 'react';

import { Typography } from '@mui/material';
import moment from 'moment';

import HighlightText from '#src-app/components/HighlightText';
import useTranslations from '#src-app/hooks/useTranslations';

import { StyledContent, StyledBox, StyledContainer, VerticalLine } from './ProcessTileContent.styles';
import { ProcessTileContentProps } from './ProcessTileContent.types';

const ProcessTileContent = forwardRef<HTMLDivElement, ProcessTileContentProps>(({ process, searchValue }, contentBoxRef) => {
    const { translate } = useTranslations();

    return (
        <StyledContent ref={contentBoxRef}>
            <StyledContainer>
                <StyledBox>
                    <Typography color='textPrimary' variant='h6' fontWeight={600}>
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
                    <Typography color='textPrimary' variant='h6' fontWeight={600}>
                        {translate('Component.Tile.Process.Content.Updated')}
                    </Typography>
                    <Typography color='textSecondary' variant='body2'>
                        {moment(process.updated).fromNow()}
                    </Typography>
                </StyledBox>
            </StyledContainer>
            <VerticalLine/>
            <StyledContainer>
                <StyledBox>
                    <Typography color='textPrimary' variant='h6' fontWeight={600}>
                        {translate('Component.Tile.Process.Content.Creator')}
                    </Typography>
                    <Typography color='textSecondary' variant='body2'>
                        <HighlightText
                            text={process.createdBy
                                ? process.createdBy.email
                                : translate('Component.Tile.Process.Content.Creator.Placeholder')
                            }
                            matchingText={searchValue}
                        />
                    </Typography>
                </StyledBox>
                <StyledBox>
                    <Typography color='textPrimary' variant='h6' fontWeight={600}>
                        {translate('Component.Tile.Process.Content.Editor')}
                    </Typography>
                    <Typography color='textSecondary' variant='body2'>
                        {process.editor
                            ? process.editor.email
                            : translate('Component.Tile.Process.Content.Editor.Placeholder')
                        }
                    </Typography>
                </StyledBox>
            </StyledContainer>
        </StyledContent>
    );
});

ProcessTileContent.displayName = 'ProcessTileContent';

export default ProcessTileContent;
