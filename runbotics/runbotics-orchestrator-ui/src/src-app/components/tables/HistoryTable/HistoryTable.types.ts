import { HTMLProps, ReactNode } from 'react';

import { SxProps, Theme } from '@mui/system';

import { Row } from 'react-table';

import { InstanceExtendedWithSubprocesses, ProcessInstanceRequestCriteria } from '#src-app/store/slices/ProcessInstance';

export interface getSubprocessesResponse { 
    type: string;
    payload: InstanceExtendedWithSubprocesses[];
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
