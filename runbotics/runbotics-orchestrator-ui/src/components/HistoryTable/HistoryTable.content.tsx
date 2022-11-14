import React, { forwardRef, HTMLProps, ReactNode, useEffect, useImperativeHandle, useRef, useState } from 'react';

import { Box, SxProps } from '@mui/material';
import { Theme } from '@mui/system';
import { unwrapResult } from '@reduxjs/toolkit';
import { useRouter } from 'next/router';
import { FeatureKey, IProcessInstance, ProcessInstanceStatus } from 'runbotics-common';

import InfoPanel from 'src/components/InfoPanel';
import useFeatureKey from 'src/hooks/useFeatureKey';
import useQuery from 'src/hooks/useQuery';
import { useReplaceQueryParams } from 'src/hooks/useReplaceQueryParams';
import { processInstanceEventActions } from 'src/store/slices/ProcessInstanceEvent';





import { useDispatch, useSelector } from '../../store';
import {
    processInstanceActions,
    ProcessInstanceRequestCriteria,
    processInstanceSelector,
} from '../../store/slices/ProcessInstance';
import { DefaultPageSize } from '../../views/process/ProcessBrowseView/ProcessList/ProcessList.utils';
import ResizableDrawer from '../ResizableDrawer';
import Table from '../Table';
import If from '../utils/If';
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
}

// eslint-disable-next-line complexity
const HistoryTable = forwardRef<any, HistoryTableProps>(({ botId, processId, sx, title }, ref) => {
    const dispatch = useDispatch();
    const tableRef = useRef<HTMLDivElement>(null);
    const processInstances = useSelector(processInstanceSelector);
    const { page: processInstancePage, loadingPage } = processInstances.all;
    const [panelInfoState, setPanelInfoState] = useState<PanelInfoState>({ show: false });
    const processInstanceColumns = useProcessInstanceColumns();
    const router = useRouter();
    const { tab, id } = router.query;
    const query = useQuery();
    const pageFromUrl = query.get('page');
    const [page, setPage] = useState(pageFromUrl ? parseInt(pageFromUrl, 10) : 0);
    const pageSizeFromUrl = query.get('pageSize');
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
        dispatch(
            processInstanceActions.getProcessInstancePage({
                page,
                size: pageSize,
                filter: {
                    equals: {
                        ...(botId && { botId }),
                        ...(processId && { processId }),
                    },
                },
            }),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageSize, page]);

    useImperativeHandle(ref, () => ({
        clearSelectedProcessInstance: () => {
            setPanelInfoState({ show: true });
        },
    }));

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
