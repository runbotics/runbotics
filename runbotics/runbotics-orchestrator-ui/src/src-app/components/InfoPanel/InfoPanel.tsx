import React, { VFC } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, SxProps, Theme } from '@mui/material';

import If from '../utils/If';
import ProcessEventBreadcrumbs from './ProcessEventBreadcrumbs';
import ProcessInstanceDetails from './ProcessInstanceDetails/ProcessInstanceDetails';
import ProcessInstanceEventsDetails from './ProcessInstanceEventsDetails';

interface InfoPanelProps {
    processInstanceId?: string;
    showCloseButton?: boolean;
    onClose?: () => void;
    sx?: SxProps<Theme>;
}

const InfoPanel: VFC<InfoPanelProps> = ({
    processInstanceId,
    onClose,
    showCloseButton = false,
}) => (
    <Box display="flex" flexDirection="column" height="100%">
        <If condition={showCloseButton}>
            <Box
                display="flex"
                justifyContent="space-between"
                paddingX="0.625rem"
            >
                <Box display="flex" alignItems="center">
                    <ProcessEventBreadcrumbs />
                </Box>
                <IconButton
                    aria-label="close"
                    size="small"
                    onClick={onClose}
                >
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
            <ProcessInstanceEventsDetails
                processInstanceId={processInstanceId}
            />
        </Box>
    </Box>
);

export default InfoPanel;
