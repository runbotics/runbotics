import React from 'react';
import { Box, IconButton, SxProps, Theme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ProcessInstanceDetails from './ProcessInstanceDetails/ProcessInstanceDetails';
import ProcessInstanceEventsDetails from './ProcessInstanceEventsDetails';
import If from '../utils/If';

export const drawerWidth = 450;

interface InfoPanelProps {
    processInstanceId?: string;
    showCloseButton?: boolean;
    onClose?: () => void;
    sx?: SxProps<Theme>;
}

const InfoPanel = ({ processInstanceId, onClose, showCloseButton = false }: InfoPanelProps) => (
    <>
        <If condition={showCloseButton}>
            <Box display="flex" justifyContent="flex-end" paddingRight="0.625rem">
                <IconButton aria-label="close" size="small" onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Box>
        </If>
        <Box
            sx={{
                ml: '3px',
                height: '100%',
                overflowY: 'auto',
                overflowX: 'hidden',
            }}
        >
            <ProcessInstanceDetails processInstanceId={processInstanceId} />
            <ProcessInstanceEventsDetails processInstanceId={processInstanceId} />
        </Box>
    </>
);

export default InfoPanel;
