import React, { useEffect, VFC } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, SxProps, Theme } from '@mui/material';

import { useDispatch } from '#src-app/store';

import { processInstanceEventActions } from '#src-app/store/slices/ProcessInstanceEvent';

import ProcessEventBreadcrumbs from './ProcessEventBreadcrumbs';
import ProcessInstanceDetails from './ProcessInstanceDetails/ProcessInstanceDetails';
import ProcessInstanceEventsDetails from './ProcessInstanceEventsDetails';
import ProcessQueueDetails from './ProcessQueueDetails/ProcessQueueDetails';
import If from '../utils/If';

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
}) => {
    const dispatch = useDispatch();

    useEffect(() => () => {
        dispatch(processInstanceEventActions.resetAll());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Box display="flex" flexDirection="column" height="100%">
            <Box
                display="flex"
                justifyContent="space-between"
                paddingX="0.625rem"
            >
                <Box display="flex" alignItems="center">
                    <ProcessEventBreadcrumbs />
                </Box>
                <If condition={showCloseButton}>
                    <IconButton
                        aria-label="close"
                        size="small"
                        onClick={onClose}
                    >
                        <CloseIcon />
                    </IconButton>
                </If>
            </Box>
            <Box
                sx={{
                    height: '100%',
                    width: '100%',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                }}
            >
                <ProcessQueueDetails />
                <ProcessInstanceDetails processInstanceId={processInstanceId} onClose={onClose}/>
                <ProcessInstanceEventsDetails
                    processInstanceId={processInstanceId}
                />
            </Box>
        </Box>
    );
};
export default InfoPanel;
