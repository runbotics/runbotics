import { FC, useRef, useState, useEffect } from 'react';

import { Box, Divider, CardHeader } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { FeatureKey } from 'runbotics-common';

import PlayIcon from '#public/images/icons/play.svg';
import SquareIcon from '#public/images/icons/square.svg';

import HighlightText from '#src-app/components/HighlightText';
import If from '#src-app/components/utils/If';
import useFeatureKey from '#src-app/hooks/useFeatureKey';
import useTranslations, { checkIfKeyExists } from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';
import { processActions } from '#src-app/store/slices/Process';
import { processInstanceActions, processInstanceSelector } from '#src-app/store/slices/ProcessInstance';
import { ProcessTab } from '#src-app/utils/process-tab';
import { capitalizeFirstLetter } from '#src-app/utils/text';

import { Description, StyledCardActionArea, RunBox } from './ProcessTile.styles';
import { ProcessTileProps } from './ProcessTile.types';
import { buildProcessUrl, checkActiveProcess } from './ProcessTile.utils';
import ProcessTileContent from './ProcessTileContent';
import ProcessTileFooter from './ProcessTileFooter';
import ProcessTileTagList from './ProcessTileTagList';
import Tile from '..';

const ProcessTile: FC<ProcessTileProps> = ({ process }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const searchFromUrl = searchParams.get('search');
    const hasProcessDetailsAccess = useFeatureKey([FeatureKey.PROCESS_LIST_DETAIL_VIEW]);
    const hasBuildTabAccess = useFeatureKey([FeatureKey.PROCESS_BUILD_VIEW]);

    const refProcessTileContent = useRef<HTMLDivElement>();

    const { enqueueSnackbar } = useSnackbar();
    const { translate } = useTranslations();
    const dispatch = useDispatch();
    const { allActiveMap: processInstanceMap } = useSelector(processInstanceSelector);
    const processInstance = processInstanceMap[process.id]?.processInstance ?? null;
    const [isProcessActive, setIsProcessActive] = useState(checkActiveProcess(processInstance));

    const handleRedirect = () => {
        if (hasBuildTabAccess) router.push(buildProcessUrl(process, ProcessTab.BUILD));
        else router.push(buildProcessUrl(process, ProcessTab.RUN));
    };

    const handleProcessRun = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        dispatch(processActions.startProcess({
            processId: process.id
        }))
            .then(unwrapResult)
            .then((response) => {
                dispatch(
                    processInstanceActions.updateOrchestratorProcessInstanceIdMap({
                        processId: process.id,
                        orchestratorProcessInstanceId: response.orchestratorProcessInstanceId,
                    })
                );

                const lastRun = (new Date()).toISOString();
                dispatch(processActions.updateProcessPage({ ...process, lastRun }));
                setIsProcessActive(true);
            })
            .catch((error) => {
                const translationKeyPrefix = 'Component.Tile.Process.Instance.Error';

                const message = error?.message ?? translate(translationKeyPrefix);
                const capitalizeMessage = capitalizeFirstLetter({ text: message, delimiter: ' ' });

                const translationKey = `${translationKeyPrefix}.${capitalizeMessage}`;

                const errorMessage = checkIfKeyExists(translationKey)
                    ? translate(translationKey)
                    : message;
                enqueueSnackbar(
                    errorMessage,
                    { variant: 'error' }
                );
            });
    };

    useEffect(() => {
        setIsProcessActive(checkActiveProcess(processInstance));
    }, [processInstance]);

    return (
        <Tile>
            <StyledCardActionArea onClick={handleRedirect}>
                <CardHeader
                    avatar={
                        <RunBox
                            onClick={handleProcessRun}
                            disabled={isProcessActive}
                        >
                            <If
                                condition={isProcessActive}
                                else={<Image src={PlayIcon} alt='Play icon'/>}
                            >
                                <Image src={SquareIcon} alt='Pause Icon'/>
                            </If>
                        </RunBox>
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
