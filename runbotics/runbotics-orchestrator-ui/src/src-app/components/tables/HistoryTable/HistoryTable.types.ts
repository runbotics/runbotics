import { HTMLProps, ReactNode } from 'react';

import { SxProps, Theme } from '@mui/system';

import { Row } from 'react-table';

import { InstanceExtendedWithSubprocesses, ProcessInstanceRequestCriteria } from '#src-app/store/slices/ProcessInstance';
import { Page } from '#src-app/utils/types/page';
export interface GetSubprocessesResponse {
    type: string;
    payload: Page<InstanceExtendedWithSubprocesses[]>
    meta: {
        arg: {
            processInstanceId: string;
        };
        requestId: string;
        requestStatus: 'fulfilled';
    }
}

export interface PanelInfoState {
    show: boolean;
    processInstanceId?: string;
}

export interface HistoryTableProps extends Omit<HTMLProps<HTMLDivElement>, 'title'> {
    botId?: ProcessInstanceRequestCriteria['botId'];
    processId?: ProcessInstanceRequestCriteria['processId'];
    title?: ReactNode;
    sx?: SxProps<Theme>;
    rerunEnabled?: boolean;
}

export interface ProcessInstanceRow extends Omit<Row, 'subRows' | 'isExpanded'>{
    original: InstanceExtendedWithSubprocesses;
    subRows?: ProcessInstanceRow[];
    isExpanded?: boolean;
}

export interface GetSubprocessesPageParams {
    currRow: ProcessInstanceRow;
    pageNum: number;
    size: number;
}
