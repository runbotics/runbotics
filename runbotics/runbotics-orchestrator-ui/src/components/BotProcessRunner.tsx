import { FC, useEffect, useState } from 'react';

import { LoadingButton } from '@mui/lab';
import { SvgIcon, Tooltip } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';

import { useSnackbar } from 'notistack';
import { Play as PlayIcon, X as XIcon } from 'react-feather';
import { FeatureKey, IProcess, ProcessInstanceStatus } from 'runbotics-common';
import styled from 'styled-components';

import useFeatureKey from 'src/hooks/useFeatureKey';
import useProcessInstanceSocket from 'src/hooks/useProcessInstanceSocket';
import useTranslations from 'src/hooks/useTranslations';
import { useDispatch, useSelector } from 'src/store';
import { processActions, StartProcessResponse } from 'src/store/slices/Process';
import { processInstanceActions, processInstanceSelector } from 'src/store/slices/ProcessInstance';

import { schedulerActions, schedulerSelector } from 'src/store/slices/Scheduler';

import { AttendedProcessModal } from './AttendedProcessModal';
import If from './utils/If';

const BOT_SEARCH_TOAST_KEY = 'bot-search-toast';

const StyledActionButton = styled(LoadingButton)(({ theme }) => `
    margin-top: ${theme.spacing(1)};
    & + & {
        margin-left: ${theme.spacing(1)};
    }
`);

interface BotProcessRunnerProps {
    className?: string;
    process?: IProcess;
    onRunClick?: () => void;
    color?: 'inherit' | 'error' | 'secondary' | 'success' | 'warning' | 'info' | 'primary';
    variant?: 'text' | 'outlined' | 'contained';
}

// eslint-disable-next-line complexity, max-lines-per-function
const BotProcessRunner: FC<BotProcessRunnerProps> = ({
    className,
    process,
    onRunClick,
    color = 'secondary',
    variant = 'text',
}) => {
    const dispatch = useDispatch();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [started, setStarted] = useState(false);
    const [isSubmitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const { translate } = useTranslations();
    const hasRunProcessAccess = useFeatureKey([FeatureKey.PROCESS_START]);
    
    const processInstances = useSelector(processInstanceSelector);
    const { activeJobs } = useSelector(schedulerSelector);
    const { orchestratorProcessInstanceId, processInstance } = processInstances.active;
    const isRunButtonDisabled = started || isSubmitting || !process.system || !process.botCollection;
    const isProcessAttended = process?.isAttended && process?.executionInfo;
    const processName = process?.name;
    const processId = process?.id;
    
    useEffect(() => {
        dispatch(schedulerActions.getActiveJobs());
    }, [dispatch, processId]);
    
    useEffect(() => {
        if (processId === activeJobs[0]?.process.id) {
            setStarted(true);
        }
    }, [activeJobs, processId]);
    
    useEffect(() => {
        const isProcessInstanceFinished = processInstance?.status === ProcessInstanceStatus.COMPLETED
            || processInstance?.status === ProcessInstanceStatus.ERRORED
            || processInstance?.status === ProcessInstanceStatus.TERMINATED;

        if (isProcessInstanceFinished) 
        { setStarted(false); }
        
    }, [processInstance]);

    useProcessInstanceSocket({ orchestratorProcessInstanceId });
    
    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);
    
    const handleTerminate = async () => {
        await dispatch(schedulerActions.terminateActiveJob({ jobId: processInstance?.id }))
            .then(() => {
                setStarted(false);
                setLoading(false);
                setSubmitting(false);
                enqueueSnackbar(translate('Scheduler.ActiveProcess.Terminate.Success', { processName }), {
                    variant: 'success',
                });
            })
            .catch(() => {
                enqueueSnackbar(translate('Scheduler.ActiveProcess.Terminate.Failed', { processName }), {
                    variant: 'error',
                });
            });
    };

    const handleRun = (executionInfo?: Record<string, any>) => {
        if (started) return;
        dispatch(processInstanceActions.resetActiveProcessInstaceAndEvents());

        enqueueSnackbar(translate('Component.BotProcessRunner.Warning'), {
            variant: 'warning',
            key: BOT_SEARCH_TOAST_KEY,
        });

        setLoading(true);
        setSubmitting(true);

        
        dispatch(
            processActions.startProcess({
                processId: process.id,
                executionInfo: isProcessAttended ? executionInfo : {},
            }),
        )
            .then(unwrapResult)
            .then( (response: StartProcessResponse) => {
                dispatch(processInstanceActions.updateOrchestratorProcessInstanceId(
                    response.orchestratorProcessInstanceId
                ));
                onRunClick?.();
                setStarted(true);
                closeModal();
            })
            .catch((error) => {
                setStarted(false);
                enqueueSnackbar(
                    error?.message as string ?? translate('Component.BotProcessRunner.Error'),
                    { variant: 'error' },
                );
            })
            .finally(() => {
                setSubmitting(false);
                setLoading(false);
                closeSnackbar(BOT_SEARCH_TOAST_KEY);
            });
    };

    const getTooltipTitle = () => {
        if (!isRunButtonDisabled) return translate('Process.MainView.Tooltip.Run.Enabled');

        return processInstance?.status === ProcessInstanceStatus.IN_PROGRESS
            ? translate('Component.BotProcessRunner.Tooltip.Title.ProcessRunning')
            : translate('Component.BotProcessRunner.Tooltip.Title.LookingForBot');
    };

    const runButton = (
        <Tooltip title={getTooltipTitle()} placement="top">
            <span>
                <StyledActionButton
                    className={className}
                    disabled={isRunButtonDisabled}
                    onClick={isProcessAttended ? openModal : handleRun}
                    color={color}
                    loading={loading}
                    loadingPosition="start"
                    startIcon={(
                        <SvgIcon fontSize="small">
                            <PlayIcon />
                        </SvgIcon>
                    )}
                    variant={variant}
                >
                    {translate('Component.BotProcessRunner.Run')}
                </StyledActionButton>
            </span>
        </Tooltip>
    );

    const terminateButton = (
        <StyledActionButton
            className={className}
            onClick={handleTerminate}
            color={color}
            loading={loading}
            loadingPosition="start"
            startIcon={(
                <SvgIcon fontSize="small">
                    <XIcon />
                </SvgIcon>
            )}
            variant={variant}
        >
            {translate('Component.BotProcessRunner.Terminate')}
        </StyledActionButton>
    );

    return (
        <If condition={hasRunProcessAccess && !started} else={terminateButton}>
            {runButton}
            <AttendedProcessModal
                open={modalOpen}
                process={process}
                setOpen={setModalOpen}
                onSubmit={handleRun}
            />
        </If>
    );
};

export default BotProcessRunner;
