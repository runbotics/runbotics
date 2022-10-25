import React, { VFC } from 'react';
import {
    Box, IconButton, SxProps, Theme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ProcessInstanceDetails from './ProcessInstanceDetails/ProcessInstanceDetails';
import ProcessInstanceEventsDetails from './ProcessInstanceEventsDetails';
import If from '../utils/If';

interface InfoPanelProps {
    processInstanceId?: string;
    showCloseButton?: boolean;
    onClose?: () => void;
    sx?: SxProps<Theme>;
}

const InfoPanel: VFC<InfoPanelProps> = ({ processInstanceId, onClose, showCloseButton = false }) => (
    <Box
        display="flex"
        flexDirection="column"
        height="100%"
    >
        <If condition={showCloseButton}>
            <Box display="flex" justifyContent="flex-end" paddingRight="0.625rem">
                <IconButton aria-label="close" size="small" onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Box>
        </If>
        <Box
            sx={{
                height: '100%',
                width: '100%',
                overflowY: 'auto',
                overflowX: 'hidden',
            }}
        >
            <ProcessInstanceDetails processInstanceId={processInstanceId} />
            <ProcessInstanceEventsDetails processInstanceId={processInstanceId} /> 
        </Box>
    </Box>
);

export default InfoPanel;
