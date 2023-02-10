import React, { VFC } from 'react';

import ReplayIcon from '@mui/icons-material/ReplayOutlined';
import { IconButton } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';

import { useSnackbar } from 'notistack';
import { ProcessInstanceStatus } from 'runbotics-common';

import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';


import { processActions, StartProcessResponse } from '#src-app/store/slices/Process';

import { processInstanceActions, processInstanceSelector } from '#src-app/store/slices/ProcessInstance';

// import { schedulerActions } from '../../store/slices/Scheduler';


interface ProcessRerunButtonProps {
    processId: number;
    input: string;
    status: ProcessInstanceStatus;
    onProcessRerun: () => void;
}

const ProcessRerunButton: VFC<ProcessRerunButtonProps> = ({ processId, input, status, onProcessRerun }) => {
    const dispatch = useDispatch();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { translate } = useTranslations();

    const isProcessFinished =
        status === ProcessInstanceStatus.COMPLETED ||
        status === ProcessInstanceStatus.ERRORED ||
        status === ProcessInstanceStatus.STOPPED;

    const handleOnClick = () => {
        if (input) {
            const jsonInput = JSON.parse(input);
            const { variables } = jsonInput;
            dispatch(processInstanceActions.resetActiveProcessInstaceAndEvents());
            
            enqueueSnackbar('Preparing for process rerun', {
                variant: 'warning'
            });

            dispatch(
                processActions.startProcess({
                    processId: processId,
                    executionInfo: { ...variables },
                }),
            )
                .then(unwrapResult)
                .then( (response: StartProcessResponse) => {
                    dispatch(processInstanceActions.updateOrchestratorProcessInstanceId(
                        response.orchestratorProcessInstanceId
                    ));
                    onProcessRerun();
                })
                .catch((error) => {
                    enqueueSnackbar(
                        'Error',
                        { variant: 'error' },
                    );
                });
        } else {
            enqueueSnackbar(
                'Input cannot be recovered',
                { variant: 'error' },
            );
        }
        
    };

    return (isProcessFinished ?
        (<IconButton sx={{ width: '40px' }} onClick={() => handleOnClick()}>
            <ReplayIcon color="secondary" />
        </IconButton>) : null
    );
};

export default ProcessRerunButton;
