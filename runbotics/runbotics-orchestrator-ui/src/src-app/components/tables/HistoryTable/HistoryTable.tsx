import React, { forwardRef, HTMLProps, ReactNode, useEffect, useImperativeHandle, useRef, useState } from 'react';

import { Box, SxProps } from '@mui/material';
import { Theme } from '@mui/system';
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

import { useDispatch, useSelector } from '../../../store';
import {
    processInstanceActions,
    ProcessInstanceRequestCriteria,
    processInstanceSelector,
} from '../../../store/slices/ProcessInstance';
import { DefaultPageSize } from '../../../views/process/ProcessBrowseView/ProcessList/ProcessList.utils';
import ResizableDrawer from '../../ResizableDrawer';
import If from '../../utils/If';
import Table from '../Table';
import useProcessInstanceColumns from './HistoryTable.columns';
import { Wrapper } from './HistoryTable.styles';



interface PanelInfoState {
    show: boolean;
    processInstanceId?: string;
}

interface HistoryTableProps extends Omit<HTMLProps<HTMLDivElement>, 'title'> {
    botId?: ProcessInstanceRequestCriteria['botId'];
    processId?: ProcessInstanceRequestCriteria['processId'];
    title?: ReactNode;
    sx?: SxProps<Theme>;
    rerunEnabled?: boolean;
}

const HistoryTable = forwardRef<any, HistoryTableProps>(({ botId, processId, sx, title, rerunEnabled }, ref) => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { translate } = useTranslations();
    const tableRef = useRef<HTMLDivElement>(null);
    const processInstances = useSelector(processInstanceSelector);
    const { page: processInstancePage, loadingPage } = processInstances.all;
    const router = useRouter();
    const { tab, id } = router.query;
    const query = useQuery();
    const pageFromUrl = query.get('page');
    const pageSizeFromUrl = query.get('pageSize');
    
    const [panelInfoState, setPanelInfoState] = useState<PanelInfoState>({ show: false });
    const [page, setPage] = useState(pageFromUrl ? parseInt(pageFromUrl, 10) : 0);
    const [pageSize, setPageSize] = useState(pageSizeFromUrl ? parseInt(pageSizeFromUrl, 10) : DefaultPageSize.TABLE);
    const hasProcessInstanceEventReadAccess = useFeatureKey([FeatureKey.PROCESS_INSTANCE_EVENT_READ]);
    const replaceQueryParams = useReplaceQueryParams();

    useEffect(() => {
        const pageNotAvailable = processInstancePage && page >= processInstancePage.totalPages;
        if (pageNotAvailable) {
            setPage(0);
            replaceQueryParams({ page, pageSize, tab, id });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [processInstancePage]);

    useEffect(() => {
        replaceQueryParams({ page, pageSize, tab, id });
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
            .catch((error) => {
                enqueueSnackbar(
                    error?.message as string ?? translate('History.Table.Error'),
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

    const handleRowExpand = (currRow) => {
        if (currRow.subRows.length > 0 || currRow.isExpanded) return;
        dispatch(processInstanceActions.getSubProcesses({ processInstanceId: currRow.original.id }))
            .then(unwrapResult)
            .catch(() => {
                enqueueSnackbar(
                    translate('History.Table.Error.SubProcessesNotFound'),
                    { variant: 'error' },
                );
                dispatch(processInstanceActions.updateProcessInstanceProps({ id: currRow.original.id, hasSubProcesses: false }));
            });
    };

    const handleOnClick = async (processInstance: IProcessInstance) => {
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
    
    const processInstanceColumns = useProcessInstanceColumns(rerunEnabled, handleRerunProcess, handleRowExpand);

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
                        setPage={setPage}
                        page={page}
                        pageSize={pageSize}
                        setPageSize={setPageSize}
                        loading={loadingPage}
                        subRowProperty="subProcesses"
                        singleSelect={hasProcessInstanceEventReadAccess}
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
