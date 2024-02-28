import { FC, useRef, useState, useEffect, useContext } from 'react';

import { Box, Divider, CardHeader, Tooltip } from '@mui/material';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { FeatureKey, ProcessQueueMessage, WsMessage, isProcessInstanceActive } from 'runbotics-common';

import PlayIcon from '#public/images/icons/play.svg';
import SquareIcon from '#public/images/icons/square.svg';

import { AttendedProcessModal } from '#src-app/components/AttendedProcessModal';
import HighlightText from '#src-app/components/HighlightText';
import If from '#src-app/components/utils/If';
import useFeatureKey from '#src-app/hooks/useFeatureKey';
import useTranslations, { checkIfKeyExists } from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';
import { processActions } from '#src-app/store/slices/Process';
import { Job, processInstanceActions, processInstanceSelector } from '#src-app/store/slices/ProcessInstance';
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
import { SocketContext } from '#src-app/providers/Socket.provider';
import useStartProcessQueueSocket from '#src-app/hooks/useStartProcessQueueSocket';

// eslint-disable-next-line max-lines-per-function
const ProcessTile: FC<ProcessTileProps> = ({ process }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const searchFromUrl = searchParams.get('search');
    const hasProcessDetailsAccess = useFeatureKey([FeatureKey.PROCESS_LIST_DETAIL_VIEW]);
    const hasBuildTabAccess = useFeatureKey([FeatureKey.PROCESS_BUILD_VIEW]);

    const refProcessTileContent = useRef<HTMLDivElement>();

    const socket = useContext(SocketContext);
    const { enqueueSnackbar } = useSnackbar();
    const { translate } = useTranslations();
    const dispatch = useDispatch();
    const { allActiveMap: processInstanceMap } = useSelector(processInstanceSelector);
    const processInstance = processInstanceMap[process.id]?.processInstance;
    const [isProcessActive, setIsProcessActive] = useState(
        processInstance && isProcessInstanceActive(processInstance.status)
    );
    const [job, setJob] = useState<Job>(null);

    const isProcessAttended = process.isAttended && Boolean(process?.executionInfo);
    const [isAttendedModalVisible, setIsAttendedModalVisible] = useState(false);

    const handleRedirect = () => {
        if (hasBuildTabAccess) router.push(buildProcessUrl(process, ProcessTab.BUILD));
        else router.push(buildProcessUrl(process, ProcessTab.RUN));
    };

    const handleRun = (executionInfo?: Record<string, any>) => {
        socket.emit(WsMessage.START_PROCESS, {
            processId: process.id,
            ...((isProcessAttended) && {
                executionInfo,
            }),
        });
        setIsProcessActive(true);
    }

    const handleWaiting = (payload: ProcessQueueMessage[WsMessage.PROCESS_WAITING]) => {
        if (payload.processId !== process.id) return;
        setJob({ ...payload, isProcessing: false, errorMessage: null });
    };

    const handleProcessing = (payload: ProcessQueueMessage[WsMessage.PROCESS_PROCESSING]) => {
        if (payload.jobId !== job?.jobId || payload.processId !== process.id) return;
        setJob(prev => ({ ...prev, isProcessing: true }));
    };

    const handleCompleted = (payload: ProcessQueueMessage[WsMessage.PROCESS_COMPLETED]) => {
        if (payload.jobId !== job?.jobId || payload.processId !== process.id) return;
        dispatch(
            processInstanceActions.updateOrchestratorProcessInstanceIdMap({
                processId: process.id,
                orchestratorProcessInstanceId: payload.orchestratorProcessInstanceId,
            })
        );
        setJob(null);
        if (isProcessAttended) setIsAttendedModalVisible(false);
    };

    const handleFailed = (payload: ProcessQueueMessage[WsMessage.PROCESS_FAILED]) => {
        if (payload.jobId !== job?.jobId || payload.processId !== process.id) return;
        const TRANSLATION_KEY_PREFIX_DEFAULT = 'Component.Tile.Process.Instance.Error';
        const message = payload.message ?? translate(TRANSLATION_KEY_PREFIX_DEFAULT);
        const capitalizedMessage = capitalizeFirstLetter({ text: message, delimiter: ' ' });
        const translationKey = `${TRANSLATION_KEY_PREFIX_DEFAULT}.${capitalizedMessage}`;

        const errorMessage = checkIfKeyExists(translationKey)
            ? translate(translationKey)
            : message;
        enqueueSnackbar(
            errorMessage,
            { variant: 'error' }
        );
        setJob(null);
        if (isProcessAttended) setIsAttendedModalVisible(false);
    }

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
            });
    };

    const handleRunButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        if (isProcessAttended) {
            setIsAttendedModalVisible(true);
        }
        else {
            handleRun();
        }
    };

    useEffect(() => {
        setIsProcessActive(
            processInstance && isProcessInstanceActive(processInstance.status)
        );
    }, [processInstance]);

    useStartProcessQueueSocket({
        onWaiting: handleWaiting,
        onProcessing: handleProcessing,
        onCompleted: handleCompleted,
        onFailed: handleFailed,
        onRemoved: (payload) => handleFailed(payload as ProcessQueueMessage[WsMessage.PROCESS_FAILED]),
        onQueueUpdate: () => {},
        job,
        loading: isProcessActive,
    });

    return (
        <Tile>
            <AttendedProcessModal
                process={process}
                open={isAttendedModalVisible}
                setOpen={setIsAttendedModalVisible}
                onSubmit={handleRun}
            />
            <StyledCardActionArea onClick={handleRedirect}>
                <CardHeader
                    avatar={
                        <If
                            condition={isProcessActive}
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
                                onClick={handleProcessTerminate}
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
                />
            </If>
        </Tile>
    );
};

export default ProcessTile;
