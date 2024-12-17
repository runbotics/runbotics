import { FC, useEffect, useState, useMemo, MouseEvent, useContext } from 'react';

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
    ProcessDto,
    IProcessInstance,
    ProcessInstanceStatus,
    isProcessInstanceFinished,
    WsMessage,
    WsQueueMessage,
} from 'runbotics-common';
import styled from 'styled-components';

import useAuth from '#src-app/hooks/useAuth';
import useFeatureKey from '#src-app/hooks/useFeatureKey';
import useTranslations, { checkIfKeyExists } from '#src-app/hooks/useTranslations';
import { SocketContext } from '#src-app/providers/Socket.provider';
import { useDispatch, useSelector } from '#src-app/store';
import { EXECUTION_LIMIT, guestsActions, guestsSelector } from '#src-app/store/slices/Guests';
import { processActions } from '#src-app/store/slices/Process/Process.slice';
import { StartProcessResponse } from '#src-app/store/slices/Process/Process.state';
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

const JOB_CREATING_TOAST_KEY = 'job-creating-toast';
const RESET_ACTIVE_TIMEOUT = 5000;

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
    process?: ProcessDto;
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
    const socket = useContext(SocketContext);
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

    const processInstances = useSelector(processInstanceSelector);
    const { processInstance, jobsMap } = processInstances.active;
    const currentProcessInstance = rerunProcessInstance ?? processInstance;
    const isProcessAttended =
        process?.isAttended && Boolean(process?.executionInfo);
    const processName = process?.name;
    const processId = process?.id;
    const isRunButtonDisabled =
        started || isSubmitting || !process.system || !process.botCollection || guestExecutionLimitExceeded;
    const isRerunButtonDisabled =
        started || isSubmitting || isProcessActive(processId, processInstance);
    const isJobQueued =
        jobsMap &&
        jobsMap[processId] &&
        jobsMap[processId].eventType === WsMessage.JOB_WAITING;

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const toggleMenu = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const closeMenu = () => {
        setAnchorEl(null);
    };

    const handleTerminate = () => {
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
            })
            .finally(() => {
                dispatch(processInstanceActions.removeFromJobsMap({ processId }));
            });
    };

    const handleRemoveJob = () => {
        const jobPayload = { ...jobsMap[processId] };
        if (!jobPayload) return;

        const eventType = jobPayload?.eventType;
        if (eventType === WsMessage.JOB_WAITING) {
            dispatch(schedulerActions.removeWaitingJob({ jobId: String(jobPayload.jobId) }))
                .then(() => {
                    enqueueSnackbar(translate(
                        'Component.BotProcessRunner.Success.RemovedJob',
                        { processName: process.name }
                    ), {
                        variant: 'success',
                    });
                })
                .catch(() => {
                    enqueueSnackbar(
                        translate('Scheduler.ActiveProcess.Terminate.Failed', {
                            processName,
                        }), {
                            variant: 'error',
                        }
                    );
                })
                .finally(() => {
                    dispatch(processInstanceActions.removeFromJobsMap({ processId }));
                    dispatch(processInstanceActions.resetActive());

                    setStarted(false);
                    setSubmitting(false);
                    setLoading(false);
                    closeSnackbar(JOB_CREATING_TOAST_KEY);
                });
        }
    };

    const handleRun = (executionInfo?: Record<string, any>) => {
        recordItemClick({ itemName: CLICKABLE_ITEM.RUN_BUTTON, sourcePage: identifyPageByUrl(pathname) });
        if (started) return;
        dispatch(processInstanceActions.removeFromJobsMap({ processId }));
        dispatch(processInstanceActions.resetActiveProcessInstanceAndEvents());
        dispatch(processInstanceEventActions.resetAll());

        enqueueSnackbar(translate('Component.BotProcessRunner.Warning.CreatingJob'), {
            variant: 'warning',
            key: JOB_CREATING_TOAST_KEY,
        });

        setLoading(true);
        setSubmitting(true);

        dispatch(processActions.startProcess({
            processId: process.id,
            clientId: socket.id,
            ...((isProcessAttended || rerunProcessInstance) && {
                executionInfo,
            }),
        }))
            .then(unwrapResult)
            .then((response: StartProcessResponse) => {
                dispatch(
                    processInstanceActions.updateOrchestratorProcessInstanceId(
                        response.orchestratorProcessInstanceId
                    )
                );
                onRunClick?.();
                closeModal();
                recordProcessRunSuccess({
                    processName,
                    processId: String(processId),
                    processInstanceId: response?.orchestratorProcessInstanceId
                });
            })
            .catch((error) => {
                handleRunFailed({
                    processId: process.id,
                    errorMessage: error?.message
                });
            });
    };

    const handleRunCompleted = () => {
        dispatch(processInstanceActions.removeFromJobsMap({ processId }));

        isGuest && dispatch(guestsActions.getCurrentGuest());

        setStarted(true);
        setSubmitting(false);
        setLoading(false);
        closeSnackbar(JOB_CREATING_TOAST_KEY);
    };

    const handleRunFailed = (payload: WsQueueMessage[WsMessage.JOB_FAILED]) => {
        setStarted(false);
        const translationKeyPrefix = 'Component.BotProcessRunner.Error';
        const defaultGuestTranslationKey = 'ServersOverloaded';

        const defaultErrorMessage =
            isGuest
                ? translate(`${translationKeyPrefix}.${defaultGuestTranslationKey}`)
                : translate(translationKeyPrefix);

        const message = payload.errorMessage ?? defaultErrorMessage;
        const translationKeyFromMessage = capitalizeFirstLetter({ text: message, delimiter: ' ' });

        const translationKey =
            (isGuest && translationKeyFromMessage === 'AllBotsAreDisconnected')
                ? `${translationKeyPrefix}.${defaultGuestTranslationKey}`
                : `${translationKeyPrefix}.${translationKeyFromMessage}`;

        const errorMessage = checkIfKeyExists(translationKey)
            ? translate(translationKey)
            : message;
        enqueueSnackbar(errorMessage, { variant: 'error' });
        recordProcessRunFail({ processName, processId: String(processId), reason: errorMessage });
        setSubmitting(false);
        setLoading(false);
        closeSnackbar(JOB_CREATING_TOAST_KEY);
        setTimeout(() => {
            dispatch(processInstanceActions.resetActive());
        }, RESET_ACTIVE_TIMEOUT);
    };

    useEffect(() => {
        setStarted(isProcessActive(processId, currentProcessInstance));
    }, [processId, currentProcessInstance]);

    useEffect(() => {
        const jobPayload = { ...jobsMap[processId] };
        if (!jobPayload) return;
        if (rerunProcessInstance &&
            processInstance?.id !== rerunProcessInstance?.id
        ) return;

        switch (jobPayload.eventType) {
            case WsMessage.PROCESS_STARTED:
                handleRunCompleted();
                break;
            case WsMessage.JOB_FAILED:
                handleRunFailed(jobPayload);
                break;
            default:
                break;
        }
    }, [jobsMap]);

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

    const removeJobButton = (
        <StyledActionButton
            className={className}
            onClick={handleRemoveJob}
            color={color}
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

    const runProcessPanel = (
        <>
            <If
                condition={hasRunProcessAccess && Boolean(rerunProcessInstance)}
                else={runButton}
            >
                { rerunMenu }
            </If>
            <AttendedProcessModal
                open={modalOpen}
                process={process}
                setOpen={setModalOpen}
                onSubmit={handleRun}
                rerunInput={rerunInput}
            />
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

    return (
        <If
            condition={hasRunProcessAccess && (started || isJobQueued)}
            else={runProcessPanel}
        >
            <If
                condition={isJobQueued}
                else={terminateButton}
            >
                { removeJobButton }
            </If>
        </If>
    );
};

export default BotProcessRunner;
