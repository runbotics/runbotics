import { FC, useEffect, useState, useMemo, MouseEvent, useContext, useCallback } from 'react';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import { LoadingButton } from '@mui/lab';
import { IconButton, SvgIcon, Tooltip, Menu, MenuItem } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';

import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { Play as PlayIcon, X as XIcon } from 'react-feather';
import {
    Role,
    FeatureKey,
    IProcess,
    IProcessInstance,
    ProcessInstanceStatus,
    isProcessInstanceFinished,
    WsMessage,
    ProcessQueueMessage,
} from 'runbotics-common';
import styled from 'styled-components';

import useAuth from '#src-app/hooks/useAuth';
import useFeatureKey from '#src-app/hooks/useFeatureKey';
import useTranslations, { checkIfKeyExists } from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';
import { EXECUTION_LIMIT, guestsActions, guestsSelector } from '#src-app/store/slices/Guests';
import {
    processInstanceActions,
    processInstanceSelector,
} from '#src-app/store/slices/ProcessInstance';
import { processInstanceEventActions } from '#src-app/store/slices/ProcessInstanceEvent';
import { schedulerActions } from '#src-app/store/slices/Scheduler';
import { CLICKABLE_ITEM } from '#src-app/utils/Mixpanel/types';
import { identifyPageByUrl, recordItemClick, recordProcessRunFail, recordProcessRunSuccess } from '#src-app/utils/Mixpanel/utils';
import { capitalizeFirstLetter } from '#src-app/utils/text';
import { isJsonValid } from '#src-app/utils/utils';

import { AttendedProcessModal } from './AttendedProcessModal';
import If from './utils/If';
import { SocketContext } from '#src-app/providers/Socket.provider';
import useStartProcessQueueSocket from '#src-app/hooks/useStartProcessQueueSocket';

const JOB_CREATING_TOAST_KEY = 'job-creating-toast';

const isProcessActive = (
    processId: number,
    processInstance: IProcessInstance
) =>
    processId === processInstance?.process.id &&
    !isProcessInstanceFinished(processInstance?.status);

const setInitialState = (processInstance: IProcessInstance) =>
    processInstance
        ? !isProcessInstanceFinished(processInstance.status)
        : false;

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
    rerunProcessInstance?: IProcessInstance;
    onRunClick?: () => void;
    color?:
        | 'inherit'
        | 'error'
        | 'secondary'
        | 'success'
        | 'warning'
        | 'info'
        | 'primary';
    variant?: 'text' | 'outlined' | 'contained';
}

// eslint-disable-next-line max-lines-per-function
const BotProcessRunner: FC<BotProcessRunnerProps> = ({
    className,
    process,
    rerunProcessInstance,
    onRunClick,
    color = 'secondary',
    variant = 'text',
}) => {
    const dispatch = useDispatch();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [started, setStarted] = useState(
        setInitialState(rerunProcessInstance)
    );
    const [isSubmitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLElement>(null);
    const { translate } = useTranslations();
    const hasRunProcessAccess = useFeatureKey([FeatureKey.PROCESS_START]);
    const { executionsCount } = useSelector(guestsSelector);
    const { user } = useAuth();
    const isGuest = user?.roles.includes(Role.ROLE_GUEST);
    const guestExecutionLimitExceeded = isGuest && executionsCount >= EXECUTION_LIMIT;
    const { pathname } = useRouter();
    const socket = useContext(SocketContext);

    const processInstances = useSelector(processInstanceSelector);
    const { processInstance, eventsMap, job } = processInstances.active;
    const currentProcessInstance = rerunProcessInstance ?? processInstance;
    const isProcessAttended =
        process?.isAttended && Boolean(process?.executionInfo);
    const processName = process?.name;
    const processId = process?.id;
    const isRunButtonDisabled =
        started || isSubmitting || !process.system || !process.botCollection || guestExecutionLimitExceeded;
    const isRerunButtonDisabled =
        started || isSubmitting || isProcessActive(processId, processInstance);

    useEffect(() => {
        setStarted(isProcessActive(processId, currentProcessInstance));
    }, [processId, currentProcessInstance]);

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const toggleMenu = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const closeMenu = () => {
        setAnchorEl(null);
    };

    const handleTerminate = () => {
        if (!started) return;

        dispatch(schedulerActions.terminateActiveJob({ jobId: processInstance?.id }))
            .then(() => {
                setStarted(false);
                setLoading(false);
                setSubmitting(false);
                enqueueSnackbar(
                    translate('Scheduler.ActiveProcess.Terminate.Success', {
                        processName,
                    }),
                    {
                        variant: 'success',
                    }
                );
            })
            .catch(() => {
                enqueueSnackbar(
                    translate('Scheduler.ActiveProcess.Terminate.Failed', {
                        processName,
                    }),
                    {
                        variant: 'error',
                    }
                );
            });
    };

    const handleWaiting = (payload: ProcessQueueMessage[WsMessage.PROCESS_WAITING]) => {
        onRunClick?.();
        dispatch(processInstanceActions.updateJob({ ...payload, isProcessing: false, errorMessage: null }));
        closeSnackbar(JOB_CREATING_TOAST_KEY);
    };

    const handleProcessing = (payload: ProcessQueueMessage[WsMessage.PROCESS_PROCESSING]) => {
      if (payload.jobId !== job?.jobId) return;
      dispatch(processInstanceActions.updateJobIsProcessing(true));
    };

    const handleCompleted = (payload: ProcessQueueMessage[WsMessage.PROCESS_COMPLETED]) => {
        if (payload.jobId !== job?.jobId) return;
        dispatch(
            processInstanceActions.updateOrchestratorProcessInstanceId(
                payload.orchestratorProcessInstanceId
            )
        );
        isGuest && dispatch(guestsActions.getGuestExecutionCount({ userId: user.id }));

        setStarted(true);
        closeModal();
        recordProcessRunSuccess({
            processName,
            processId: String(processId),
            processInstanceId: payload?.orchestratorProcessInstanceId
        });
        setSubmitting(false);
        setLoading(false);
        dispatch(processInstanceActions.updateJob({ jobId: null, jobIndex: null, isProcessing: false, errorMessage: null }));
    };

    const handleFailed = (payload: ProcessQueueMessage[WsMessage.PROCESS_FAILED]) => {
        if (payload.jobId !== job?.jobId) return;
        onRunClick?.();
        setStarted(false); 
        const translationKeyPrefix = 'Component.BotProcessRunner.Error';
        const guestMessage = 'ServersAreOverloaded';

        const basicErrorMessage =
            isGuest
                ? translate(`${translationKeyPrefix}.${guestMessage}`)
                : translate(translationKeyPrefix);

        const message = payload?.message ?? basicErrorMessage;
        const capitalizeMessage = capitalizeFirstLetter({ text: message, delimiter: ' ' });

        const translationKey =
            (isGuest && capitalizeMessage === 'AllBotsAreDisconnected')
                ? `${translationKeyPrefix}.${guestMessage}`
                : `${translationKeyPrefix}.${capitalizeMessage}`;

        const errorMessage = checkIfKeyExists(translationKey)
            ? translate(translationKey)
            : message;
        recordProcessRunFail({ processName, processId: String(processId), reason: errorMessage });
        setSubmitting(false);
        setLoading(false);
        dispatch(processInstanceActions.updateJob({ jobId: null, jobIndex: null, isProcessing: false, errorMessage }));
    };

    const handleRemoved = (payload: ProcessQueueMessage[WsMessage.PROCESS_REMOVED]) => {
        if (payload.jobId !== job?.jobId) return;
        setStarted(false); 
        const translationKeyPrefix = 'Component.BotProcessRunner.Error.RemovedJob';
        const guestMessage = 'ServersAreOverloaded';

        const basicErrorMessage =
            isGuest
                ? translate(`${translationKeyPrefix}.${guestMessage}`)
                : translate(translationKeyPrefix);

        const capitalizeMessage = capitalizeFirstLetter({ text: basicErrorMessage, delimiter: ' ' });

        const translationKey =
            (isGuest && capitalizeMessage === 'AllBotsAreDisconnected')
                ? `${translationKeyPrefix}.${guestMessage}`
                : `${translationKeyPrefix}.${capitalizeMessage}`;

        const errorMessage = checkIfKeyExists(translationKey)
            ? translate(translationKey)
            : basicErrorMessage;
        recordProcessRunFail({ processName, processId: String(processId), reason: errorMessage });
        setSubmitting(false);
        setLoading(false);
        dispatch(processInstanceActions.updateJob({ jobId: null, jobIndex: null, isProcessing: false, errorMessage }));
    };

    const handleQueueUpdate = (payload: ProcessQueueMessage[WsMessage.PROCESS_QUEUE_UPDATE]) => {
        if (job?.jobId && payload.jobId !== job?.jobId) {
            dispatch(processInstanceActions.decrementJobIndex());
        }
    };

    useStartProcessQueueSocket({
        onWaiting: handleWaiting,
        onProcessing: handleProcessing,
        onCompleted: handleCompleted,
        onFailed: handleFailed,
        onRemoved: handleRemoved,
        onQueueUpdate: handleQueueUpdate,
        job,
        loading,
    });

    const handleRun = (executionInfo?: Record<string, any>) => {
        recordItemClick({ itemName: CLICKABLE_ITEM.RUN_BUTTON, sourcePage: identifyPageByUrl(pathname) });
        if (started) return;
        dispatch(processInstanceActions.resetActiveProcessInstanceAndEvents());
        dispatch(processInstanceActions.updateJob(null));
        dispatch(processInstanceEventActions.resetAll());

        enqueueSnackbar(translate('Component.BotProcessRunner.Warning.CreatingJob'), {
            variant: 'warning',
            key: JOB_CREATING_TOAST_KEY,
        });

        setLoading(true);
        setSubmitting(true);

        socket.emit(WsMessage.START_PROCESS, {
            processId: process.id,
            ...((isProcessAttended || rerunProcessInstance) && {
                executionInfo,
            }),
        });
    };

    const rerunInput = useMemo(() => {
        if (!isJsonValid(rerunProcessInstance?.input)) return null;

        return JSON.parse(rerunProcessInstance?.input);
    }, [rerunProcessInstance?.id]);

    const getTooltipTitle = () => {
        if (!isRunButtonDisabled) {
            return translate('Process.MainView.Tooltip.Run.Enabled');
        } else if (guestExecutionLimitExceeded) {
            return translate('Process.MainView.Tooltip.Run.Disabled.ForGuest');
        }

        return processInstance?.status === ProcessInstanceStatus.IN_PROGRESS
            ? translate(
                'Component.BotProcessRunner.Tooltip.Title.ProcessRunning'
            )
            : translate(
                'Component.BotProcessRunner.Tooltip.Title.LookingForBot'
            );
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
                    startIcon={
                        <SvgIcon fontSize="small">
                            <PlayIcon />
                        </SvgIcon>
                    }
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
            startIcon={
                <SvgIcon fontSize="small">
                    <XIcon />
                </SvgIcon>
            }
            variant={variant}
        >
            {translate('Component.BotProcessRunner.Terminate')}
        </StyledActionButton>
    );

    const rerunMenu = (
        <>
            <IconButton sx={{ width: '40px' }} onClick={toggleMenu}>
                <MoreVertIcon />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                keepMounted
                open={!!anchorEl}
                onClose={closeMenu}
            >
                <MenuItem onClick={openModal} disabled={isRerunButtonDisabled}>
                    {translate('Component.BotProcessRunner.Menu.RerunProcess')}
                </MenuItem>
            </Menu>
        </>
    );

    if (
        rerunProcessInstance &&
        (!isProcessAttended ||
            !rerunInput?.variables ||
            Object.keys(rerunInput.variables).length === 0)
    ) {
        return null;
    }

    const hasEventStarted = eventsMap && Object.keys(eventsMap).length > 0;

    return (
        <If
            condition={hasRunProcessAccess && (!started || !hasEventStarted)}
            else={terminateButton}
        >
            <If condition={Boolean(rerunProcessInstance)} else={runButton}>
                {rerunMenu}
            </If>
            <AttendedProcessModal
                open={modalOpen}
                process={process}
                setOpen={setModalOpen}
                onSubmit={handleRun}
                rerunInput={rerunInput}
            />
        </If>
    );
};

export default BotProcessRunner;
