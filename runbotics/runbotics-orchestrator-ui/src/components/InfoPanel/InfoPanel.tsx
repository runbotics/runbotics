import React, { VFC } from 'react';
import styled from 'styled-components';
import {
    Box, IconButton, SxProps, Theme,
} from '@mui/material';
import ResizableDrawer from 'src/components/ResizableDrawer';
import CloseIcon from '@mui/icons-material/Close';
import ProcessInstanceDetails from './ProcessInstanceDetails/ProcessInstanceDetails';
import ProcessInstanceEventsDetails from './ProcessInstanceEventsDetails';
import If from '../utils/If';

export const drawerWidth = 450;

const StyledResizableDrawer = styled(ResizableDrawer)({
    minHeight: '100%',
    '& .drawerPaper': {
        top: 'auto',
        width: drawerWidth,
        position: 'relative',
        borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
        height: '100%',
    },
});

interface InfoPanelProps {
    processInstanceId?: string;
    showCloseButton?: boolean;
    onClose?: () => void;
    sx?: SxProps<Theme>;
}

const InfoPanel: VFC<InfoPanelProps> = ({
    processInstanceId, onClose, showCloseButton, sx,
}) => (
    <StyledResizableDrawer open variant="permanent" anchor="right" sx={sx} classes={{ paper: 'drawerPaper' }}>
        <If condition={showCloseButton}>
            <Box display="flex" justifyContent="flex-end" paddingRight="0.625rem">
                <IconButton aria-label="close" size="small" onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Box>
        </If>
        <Box sx={{
            ml: '3px', height: '100%', overflowY: 'auto', overflowX: 'hidden',
        }}
        >
            <ProcessInstanceDetails processInstanceId={processInstanceId} />
            <ProcessInstanceEventsDetails processInstanceId={processInstanceId} />
        </Box>
    </StyledResizableDrawer>
);

export default InfoPanel;
