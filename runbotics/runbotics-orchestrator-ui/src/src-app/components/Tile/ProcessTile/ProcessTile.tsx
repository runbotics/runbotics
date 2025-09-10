import { FC, useRef, useState, useEffect, useContext } from 'react';

import { Box, Divider, CardHeader, Tooltip } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { FeatureKey, StartProcessResponse, WsMessage, WsQueueMessage, isProcessInstanceActive } from 'runbotics-common';

import PlayIcon from '#public/images/icons/play.svg';
import SquareIcon from '#public/images/icons/square.svg';

import { AttendedProcessModal } from '#src-app/components/AttendedProcessModal';
import HighlightText from '#src-app/components/HighlightText';
import If from '#src-app/components/utils/If';
import useFeatureKey from '#src-app/hooks/useFeatureKey';
import useTranslations, { checkIfKeyExists } from '#src-app/hooks/useTranslations';
import { SocketContext } from '#src-app/providers/Socket.provider';
import { useDispatch, useSelector } from '#src-app/store';
import { processActions } from '#src-app/store/slices/Process';
import { processInstanceActions, processInstanceSelector } from '#src-app/store/slices/ProcessInstance';
import { schedulerActions } from '#src-app/store/slices/Scheduler';
import { ProcessTab } from '#src-app/utils/process-tab';
import { capitalizeFirstLetter } from '#src-app/utils/text';

import { Description, StyledCardActionArea, RunBox } from './ProcessTile.styles';
import { ProcessTileProps } from './ProcessTile.types';
import { buildProcessUrl } from './ProcessTile.utils';
import ProcessTileContent from './ProcessTileContent';
import ProcessTileFooter from './ProcessTileFooter';
import ProcessTileTagList from './ProcessTileTagList';
import Tile from '..';

const JOB_CREATING_TOAST_KEY = 'job-creating-toast';

// eslint-disable-next-line max-lines-per-function
const ProcessTile: FC<ProcessTileProps> = ({ process }) => {
    const router = useRouter();
    const socket = useContext(SocketContext);
    const searchParams = useSearchParams();
    const searchFromUrl = searchParams.get('search');
    const hasProcessDetailsAccess = useFeatureKey([FeatureKey.PROCESS_LIST_DETAIL_VIEW]);
    const hasBuildTabAccess = useFeatureKey([FeatureKey.PROCESS_BUILD_VIEW]);

    const refProcessTileContent = useRef<HTMLDivElement>();

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { translate } = useTranslations();
    const dispatch = useDispatch();
    const { allActiveMap: processInstanceMap, active: { jobsMap } } = useSelector(processInstanceSelector);
    const processInstance = processInstanceMap[process.id]?.processInstance;
    const [isProcessActive, setIsProcessActive] = useState(
        processInstance && isProcessInstanceActive(processInstance.status)
    );

    const isProcessAttended = process.isAttended && Boolean(process?.executionInfo);
    const [isAttendedModalVisible, setIsAttendedModalVisible] = useState(false);
    const processId = process?.id;
    const isJobWaiting =
        jobsMap &&
        jobsMap[processId] &&
        jobsMap[processId].eventType === WsMessage.JOB_WAITING;
    const isJobCreating =
        jobsMap &&
        jobsMap[processId] &&
        jobsMap[processId].eventType === WsMessage.JOB_ACTIVE;
    const isJobQueued = isJobWaiting || isJobCreating;

    const handleRedirect = () => {
        if (hasBuildTabAccess) router.push(buildProcessUrl(process, ProcessTab.BUILD));
        else router.push(buildProcessUrl(process, ProcessTab.RUN));
    };

    const handleProcessRun = (executionInfo?: Record<string, any>) => {
        if (isProcessActive) return;
        dispatch(processInstanceActions.removeFromJobsMap({ processId }));

        enqueueSnackbar(translate('Component.BotProcessRunner.Warning.CreatingJob'), {
            variant: 'warning',
            key: JOB_CREATING_TOAST_KEY,
        });

        dispatch(processActions.startProcess({
            processId: process.id,
            clientId: socket.id,
            ...((isProcessAttended) && {
                executionInfo,
            }),
        }))
            .then(unwrapResult)
            .then((response: StartProcessResponse) => {
                dispatch(
                    processInstanceActions.updateOrchestratorProcessInstanceIdMap({
                        processId: process.id,
                        orchestratorProcessInstanceId: response.orchestratorProcessInstanceId,
                    })
                );
            })
            .catch((error) => {
                handleRunFailed({
                    processId: process.id,
                    errorMessage: error?.message
                });
            });

        if (isProcessAttended) setIsAttendedModalVisible(false);
    };

    const handleRunCompleted = () => {
        dispatch(processInstanceActions.removeFromJobsMap({ processId }));

        setIsProcessActive(true);
        closeSnackbar(JOB_CREATING_TOAST_KEY);
    };

    const handleRunFailed = (payload: WsQueueMessage[WsMessage.JOB_FAILED]) => {
        setIsProcessActive(false);
        const TRANSLATION_KEY_PREFIX_DEFAULT = 'Component.Tile.Process.Instance.Error';
        const message = payload.errorMessage ?? translate(TRANSLATION_KEY_PREFIX_DEFAULT);
        const capitalizedMessage = capitalizeFirstLetter({ text: message, delimiter: ' ' });
        const translationKey = `${TRANSLATION_KEY_PREFIX_DEFAULT}.${capitalizedMessage}`;

        const errorMessage = checkIfKeyExists(translationKey)
            ? translate(translationKey)
            : message;
        enqueueSnackbar(
            errorMessage,
            { variant: 'error' }
        );

        closeSnackbar(JOB_CREATING_TOAST_KEY);
        dispatch(processInstanceActions.removeFromJobsMap({ processId }));
        if (isProcessAttended) setIsAttendedModalVisible(false);
    };

    const handleProcessTerminate = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        const processName = process.name;

        dispatch(schedulerActions.terminateActiveJob({ jobId: processInstance?.id }))
            .then(() => {
                enqueueSnackbar(
                    translate('Scheduler.ActiveProcess.Terminate.Success', {
                        processName,
                    }), { variant: 'success' }
                );
            })
            .catch(() => {
                enqueueSnackbar(
                    translate('Scheduler.ActiveProcess.Terminate.Failed', {
                        processName,
                    }), { variant: 'error' }
                );
            })
            .finally(() => {
                dispatch(processInstanceActions.removeFromJobsMap({ processId }));
            });
    };

    const handleRemoveJob = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        if (isJobCreating) {
            enqueueSnackbar(translate('Component.BotProcessRunner.Warning.RemoveJob'), {
                variant: 'warning',
            });
            return;
        }

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
                            processName: process.name,
                        }),
                        {
                            variant: 'error',
                        }
                    );
                })
                .finally(() => {
                    dispatch(processInstanceActions.removeFromJobsMap({ processId }));

                    setIsProcessActive(false);
                    closeSnackbar(JOB_CREATING_TOAST_KEY);
                    if (isProcessAttended) setIsAttendedModalVisible(false);
                });
        }
    };

    const handleRunButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        if (isProcessAttended) {
            setIsAttendedModalVisible(true);
        }
        else {
            handleProcessRun();
        }
    };

    useEffect(() => {
        setIsProcessActive(
            processInstance && isProcessInstanceActive(processInstance.status)
        );
    }, [processInstance]);

    useEffect(() => {
        const jobPayload = { ...jobsMap[processId] };
        if (!jobPayload) return;

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jobsMap]);

    return (
        <Tile>
            <AttendedProcessModal
                process={process}
                open={isAttendedModalVisible}
                setOpen={setIsAttendedModalVisible}
                onSubmit={handleProcessRun}
            />
            <StyledCardActionArea onClick={handleRedirect}>
                <CardHeader
                    avatar={
                        <If
                            condition={isProcessActive || isJobQueued}
                            else={
                                <RunBox
                                    onClick={handleRunButtonClick}
                                >
                                    <Tooltip title={translate('Component.Tile.Process.Header.Tooltip.RunProcess')}>
                                        <Image
                                            src={PlayIcon}
                                            alt={translate('Component.Tile.Process.Header.Alt.PlayIcon')}
                                        />
                                    </Tooltip>
                                </RunBox>
                            }
                        >
                            <RunBox
                                onClick={isJobQueued ? handleRemoveJob : handleProcessTerminate}
                            >
                                <Tooltip title={translate('Component.Tile.Process.Header.Tooltip.AbortProcess')}>
                                    <Image
                                        src={SquareIcon}
                                        alt={translate('Component.Tile.Process.Header.Alt.SquareIcon')}
                                    />
                                </Tooltip>
                            </RunBox>
                        </If>
                    }
                    title={
                        <HighlightText
                            text={process.name}
                            matchingText={searchFromUrl}
                        />
                    }
                    titleTypographyProps={{ variant: 'h5' }}
                    sx={{ width: '100%', paddingBottom: '5px' }}
                    onClick={handleRedirect}
                />
                <ProcessTileTagList
                    tags={process.tags}
                    searchValue={searchFromUrl}
                    refProcessTileContent={refProcessTileContent}
                />
                <If condition={hasProcessDetailsAccess}>
                    <ProcessTileContent
                        ref={refProcessTileContent}
                        process={process}
                        searchValue={searchFromUrl}
                    />
                </If>
                <If condition={!hasProcessDetailsAccess && Boolean(process.description)}>
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        width="100%"
                        height="100%"
                        paddingBottom="1rem"
                    >
                        <Description color="textSecondary" variant="body2">
                            {process.description}
                        </Description>
                    </Box>
                </If>
            </StyledCardActionArea>
            <If condition={hasProcessDetailsAccess}>
                <Divider />
                <ProcessTileFooter
                    process={process}
                    processInstance={processInstance}
                    isJobWaiting={isJobWaiting}
                    isJobCreating={isJobCreating}
                />
            </If>
        </Tile>
    );
};

export default ProcessTile;
