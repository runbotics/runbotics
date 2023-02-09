import React, { VFC } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import {
    Box,
    Breadcrumbs,
    IconButton,
    SxProps,
    Theme,
    Chip,
} from '@mui/material';

import { useDispatch, useSelector } from '#src-app/store';

import { processInstanceEventActions, processInstanceEventSelector } from '#src-app/store/slices/ProcessInstanceEvent';

import If from '../utils/If';
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
}) => {
    const { eventsBreadcrumbTrail } = useSelector(
        (state) => state.processInstanceEvent.all
    );
    const dispatch = useDispatch();
    const {all: {nestedEvents: {idNameMap}}} = useSelector(processInstanceEventSelector);
    return (
        <Box display="flex" flexDirection="column" height="100%">
            <If condition={showCloseButton}>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    paddingX="0.625rem"
                >
                    <Box display="flex" alignItems="center">
                        <Breadcrumbs 
                            aria-label="breadcrumb"
                            maxItems={3}
                        >
                            {eventsBreadcrumbTrail.length > 1 ? (
                                eventsBreadcrumbTrail.map((breadcrumb) => (
                                    <Chip
                                        key={breadcrumb}
                                        onClick={() => {
                                            dispatch(processInstanceEventActions.reduceCrumbs(breadcrumb));
                                        }}
                                        label={idNameMap[breadcrumb] ?? breadcrumb}
                                        size="small"
                                        sx={{marginY: (theme) => theme.spacing(0.5)}}
                                    />
                                ))
                            ) : (
                                null
                            )}
                        </Breadcrumbs>
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
};

export default InfoPanel;
