import { FC, useEffect, useState } from 'react';

import { LoadingButton } from '@mui/lab';
import { IconButton, SvgIcon, Tooltip } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';

import { useSnackbar } from 'notistack';
import {
    Play as PlayIcon,
    X as XIcon,
    RefreshCw as RerunIcon
} from 'react-feather';
import {
    FeatureKey,
    IProcess,
    IProcessInstance,
    ProcessInstanceStatus,
} from 'runbotics-common';
import styled from 'styled-components';

import useFeatureKey from '#src-app/hooks/useFeatureKey';
import useProcessInstanceSocket from '#src-app/hooks/useProcessInstanceSocket';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';
import {
    processActions,
    StartProcessResponse,
} from '#src-app/store/slices/Process';
import {
    processInstanceActions,
    processInstanceSelector,
} from '#src-app/store/slices/ProcessInstance';

import { processInstanceEventActions } from '#src-app/store/slices/ProcessInstanceEvent';
import { schedulerActions } from '#src-app/store/slices/Scheduler';

import { AttendedProcessModal } from './AttendedProcessModal';
import If from './utils/If';

const BOT_SEARCH_TOAST_KEY = 'bot-search-toast';

const isProcessInstanceFinished = (processInstance: IProcessInstance) => 
    processInstance?.status === ProcessInstanceStatus.COMPLETED ||
    processInstance?.status === ProcessInstanceStatus.ERRORED ||
    processInstance?.status === ProcessInstanceStatus.TERMINATED;

const isProcessActive = (processId: number, processInstance: IProcessInstance) => processId === processInstance?.process.id && !isProcessInstanceFinished(processInstance);

const StyledActionButton = styled(LoadingButton)(
    ({ theme }) => `
    margin-top: ${theme.spacing(1)};
    & + & {
        margin-left: ${theme.spacing(1)};
    }
`
);

interface BotProcessRunnerProps {
    className?: string;
    process?: IProcess;
    externalProcessInstance?: IProcessInstance;
    isProcessInstanceActive?: boolean;
    onRunClick?: () => void;
    color?: 'inherit' | 'error' | 'secondary' | 'success' | 'warning' | 'info' | 'primary';
    variant?: 'text' | 'outlined' | 'contained';
}

// eslint-disable-next-line complexity, max-lines-per-function
const BotProcessRunner: FC<BotProcessRunnerProps> = ({
    className,
    process,
    externalProcessInstance,
    isProcessInstanceActive,
    onRunClick,
    color = 'secondary',
    variant = 'text',
}) => {
    const dispatch = useDispatch();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [started, setStarted] = useState(isProcessInstanceActive);
    const [isSubmitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const { translate } = useTranslations();
    const hasRunProcessAccess = useFeatureKey([FeatureKey.PROCESS_START]);

    const processInstances = useSelector(processInstanceSelector);
    const { orchestratorProcessInstanceId, processInstance } = processInstances.active;
    const currentProcessInstance = externalProcessInstance ?? processInstance;
    const isProcessAttended = process?.isAttended && process?.executionInfo;
    const processName = process?.name;
    const processId = process?.id;
    const isRunButtonDisabled =
        started || isSubmitting || !process.system || !process.botCollection;
    const isRerunButtonDisabled = isProcessActive(processId, processInstance) || started || isSubmitting;

    useEffect(() => {
        if (started) return;
        if (isProcessActive(processId, currentProcessInstance)) {
            setStarted(true);
        }
    }, [started, processId, currentProcessInstance]);

    useEffect(() => {
        if (isProcessInstanceFinished(currentProcessInstance)) {
            setStarted(false);
        }
    }, [currentProcessInstance]);

    useProcessInstanceSocket({ orchestratorProcessInstanceId });

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const handleTerminate = async () => {
        await dispatch(
            schedulerActions.terminateActiveJob({ jobId: processInstance?.id })
        )
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
        dispatch(processInstanceEventActions.resetAll());

        enqueueSnackbar(translate('Component.BotProcessRunner.Warning'), {
            variant: 'warning',
            key: BOT_SEARCH_TOAST_KEY,
        });

        setLoading(true);
        setSubmitting(true);

        dispatch(
            processActions.startProcess({
                processId: process.id,
                executionInfo: ((isProcessAttended || externalProcessInstance) && { ...executionInfo }),
            })
        )
            .then(unwrapResult)
            .then((response: StartProcessResponse) => {
                dispatch(
                    processInstanceActions.updateOrchestratorProcessInstanceId(
                        response.orchestratorProcessInstanceId
                    )
                );
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

    const handleRerun = () => {
        const input = JSON.parse(currentProcessInstance?.input);
        const { variables } = input;
        handleRun(variables);
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

    const rerunButton = (
        <Tooltip title={translate('Component.BotProcessRunner.Tooltip.Title.RerunProcess')} placement="top">
            <IconButton sx={{ width: '40px' }} disabled={isRerunButtonDisabled} onClick={() => handleRerun()}>
                <SvgIcon fontSize="small" color={isRerunButtonDisabled ? 'disabled' : 'secondary'}>
                    <RerunIcon />
                </SvgIcon>
            </IconButton>
        </Tooltip>
    );
    
    if (externalProcessInstance) {
        return (
            <If condition={!started} else={null}>
                {rerunButton}
            </If>
        );
    }

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
