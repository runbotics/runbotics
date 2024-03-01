import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

import { Box } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { FeatureKey, IProcessInstance, ProcessInstanceStatus } from 'runbotics-common';

import InfoPanel from '#src-app/components/InfoPanel';

import useFeatureKey from '#src-app/hooks/useFeatureKey';

import useQuery from '#src-app/hooks/useQuery';

import { useReplaceQueryParams } from '#src-app/hooks/useReplaceQueryParams';
import useTranslations from '#src-app/hooks/useTranslations';

import { processInstanceEventActions } from '#src-app/store/slices/ProcessInstanceEvent';

import useProcessInstanceColumns from './HistoryTable.columns';
import { Wrapper } from './HistoryTable.styles';
import { HistoryTableProps, PanelInfoState } from './HistoryTable.types';
import { useDispatch, useSelector } from '../../../store';
import {
    processInstanceActions,
    processInstanceSelector,
} from '../../../store/slices/ProcessInstance';
import { DefaultPageSize } from '../../../views/process/ProcessBrowseView/ProcessList/ProcessList.utils';
import ResizableDrawer from '../../ResizableDrawer';
import If from '../../utils/If';
import Table from '../Table';

const HistoryTable = forwardRef<any, HistoryTableProps>(({ botId, processId, sx, title, rerunEnabled }, ref) => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { translate } = useTranslations();
    const tableRef = useRef<HTMLDivElement>(null);
    const processInstances = useSelector(processInstanceSelector);
    const { page: processInstancePage, loadingPage } = processInstances.all;
    const router = useRouter();
    const { tab, id } = router.query;
    const { firstValueFrom } = useQuery();
    const pageFromUrl = firstValueFrom('page');
    const pageSizeFromUrl = firstValueFrom('pageSize');
    const processInstanceIdFromUrl = firstValueFrom('instanceId');

    const [panelInfoState, setPanelInfoState] = useState<PanelInfoState>({ show: false });
    const [page, setPage] = useState(pageFromUrl ? parseInt(pageFromUrl, 10) : 0);
    const [pageSize, setPageSize] = useState(pageSizeFromUrl ? parseInt(pageSizeFromUrl, 10) : DefaultPageSize.TABLE);
    const [instanceId, setInstanceId] = useState(processInstanceIdFromUrl ?? null);
    const hasProcessInstanceEventReadAccess = useFeatureKey([FeatureKey.PROCESS_INSTANCE_EVENT_READ]);
    const replaceQueryParams = useReplaceQueryParams();

    useEffect(() => {
        const pageNotAvailable = processInstancePage && page >= processInstancePage.totalPages;
        if (pageNotAvailable) {
            setPage(0);
            replaceQueryParams({ page, pageSize, tab, id, instanceId });
            return;
        }
        if (processInstancePage?.number) {
            setPage(processInstancePage.number);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [processInstancePage]);

    useEffect(() => {
        replaceQueryParams({ page, pageSize, tab, id, instanceId });

        if (instanceId) {
            dispatch(processInstanceActions.getProcessInstancePageWithSpecificInstance({
                size: pageSize,
                instanceId,
                filter: {
                    equals: {
                        ...(botId && { botId }),
                        ...(processId && { processId }),
                    },
                },
            }))
                .then(unwrapResult)
                .catch(() => {
                    enqueueSnackbar(
                        translate('History.Table.Error.InstancesNotFound'),
                        { variant: 'error' },
                    );
                });
            setPanelInfoState({ show: true, processInstanceId: instanceId });
            return;
        }

        dispatch(processInstanceActions.getProcessInstancePage({
            page,
            size: pageSize,
            filter: {
                equals: {
                    ...(botId && { botId }),
                    ...(processId && { processId }),
                },
            },
        }))
            .then(unwrapResult)
            .catch(() => {
                enqueueSnackbar(
                    translate('History.Table.Error.InstancesNotFound'),
                    { variant: 'error' },
                );
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageSize, page]);

    useImperativeHandle(ref, () => ({
        clearSelectedProcessInstance: () => {
            setPanelInfoState({ show: true });
        },
    }));

    const handleOnClick = async (processInstance: IProcessInstance) => {
        setInstanceId(processInstance.id);
        replaceQueryParams({ page, pageSize, tab, id, instanceId: processInstance.id });
        setPanelInfoState({ show: true, processInstanceId: processInstance.id });
        if (
            processInstance.status === ProcessInstanceStatus.INITIALIZING ||
            processInstance.status === ProcessInstanceStatus.IN_PROGRESS
        ) {
            await dispatch(
                processInstanceEventActions.getProcessInstanceEvents({ processInstanceId: processInstance.id }),
            )
                .then(unwrapResult)
                .then((events) => dispatch(processInstanceActions.updateActiveEvents(events)));
            dispatch(
                processInstanceActions.updateOrchestratorProcessInstanceId(
                    processInstance.orchestratorProcessInstanceId,
                ),
            );
        } else {
            dispatch(processInstanceActions.resetActive());
        }
    };

    const handleCloseButton = () => {
        setPanelInfoState({ show: false });
    };

    const handleRerunProcess = () => {
        setPanelInfoState({ show: true });
    };

    const handleSetPage = (newPage: number) => {
        setInstanceId(null);
        setPage(newPage);
    };

    const handleSetPageSize = (newPageSize: number) => {
        setInstanceId(null);
        setPageSize(newPageSize);
    };
    
    const processInstanceColumns = useProcessInstanceColumns(rerunEnabled, handleRerunProcess);

    return (
        <Wrapper>
            {title}
            <Box sx={{ display: 'flex', gap: '0.75rem' }}>
                <Box ref={tableRef} sx={{ ...sx, width: '100%' }}>
                    <Table
                        columns={processInstanceColumns}
                        data={processInstancePage?.content ?? []}
                        totalPages={processInstancePage?.totalPages ?? 1}
                        onRowClick={hasProcessInstanceEventReadAccess ? handleOnClick : undefined}
                        setPage={handleSetPage}
                        page={page}
                        pageSize={pageSize}
                        setPageSize={handleSetPageSize}
                        loading={loadingPage}
                        subRowProperty="subprocesses"
                        singleSelect={hasProcessInstanceEventReadAccess}
                        instanceId={instanceId}
                    />
                </Box>
                <If condition={panelInfoState.show && hasProcessInstanceEventReadAccess}>
                    <ResizableDrawer open>
                        <InfoPanel
                            processInstanceId={panelInfoState.processInstanceId}
                            onClose={handleCloseButton}
                            showCloseButton
                            sx={{ maxHeight: `${tableRef.current?.clientHeight ?? 0}px` }}
                        />
                    </ResizableDrawer>
                </If>
            </Box>
        </Wrapper>
    );
});

HistoryTable.displayName = 'HistoryTable';

export default HistoryTable;
