import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from '@mui/icons-material/Error';
import QueueIcon from '@mui/icons-material/Queue';
import { Typography } from '@mui/material';
import React, { FunctionComponent } from 'react';
import {
    ProcessTileActions, ProcessTileProps, Footer, IconsWrapper, StyledSvg,
} from '.';

const ProcessTileFooter: FunctionComponent<ProcessTileProps> = ({ process }) => (
    <Footer>
        <IconsWrapper>
            <StyledSvg fontSize="small" color="action">
                <QueueIcon />
            </StyledSvg>
            <Typography variant="subtitle2" color="textSecondary">
                {process.executionsCount}
            </Typography>
            <StyledSvg fontSize="small" color="action">
                <CheckIcon />
            </StyledSvg>
            <Typography variant="subtitle2" color="textSecondary">
                {process.successExecutionsCount}
            </Typography>
            <StyledSvg fontSize="small" color="action">
                <ErrorIcon />
            </StyledSvg>
            <Typography variant="subtitle2" color="textSecondary">
                {process.failureExecutionsCount}
            </Typography>
        </IconsWrapper>
        <ProcessTileActions process={process} />
    </Footer>
);

export default ProcessTileFooter;
