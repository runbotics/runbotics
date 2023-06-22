import { HTMLProps, ReactNode } from 'react';

import { SxProps, Theme } from '@mui/system';
import { Column as ReactTableColumn, Row } from 'react-table';
import { FeatureKey } from 'runbotics-common';

import { ProcessInstanceRequestCriteria, InstanceExtendedWithSubProcesses } from '#src-app/store/slices/ProcessInstance';

export interface DataTableFooterProps {
    pageCount: number;
    pageSize: number;
    setPageSize: (setPageSize: number) => void;
    page: number;
    setPage: (setPageSize: number) => void;
    sx?: SxProps<Theme>;
}

export interface DataTableProps<T extends object> {
    columns: Column<T>[];
    data: T[];
    totalPages?: number;
    onRowClick?: (rowData: T) => void;
    setPage?: (setPage: number) => void;
    setPageSize?: (setPageSize: number) => void;
    pageSize?: number;
    page?: number;
    loading?: boolean;
    subRowProperty?: string;
    renderSubRow?: (row: Row<T> | ProcessInstanceRow) => ReactNode;
    singleSelect?: boolean;
    autoHeight?: boolean;
}

export interface TableRowExpanderProps {
    row: Row;
    handleClick?: (row: ProcessInstanceRow) => void;
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
    original: InstanceExtendedWithSubProcesses;
    subRows?: ProcessInstanceRow[];
    isExpanded?: boolean;
}


export type Column<D extends object = {}> = ReactTableColumn<D> & {
    featureKeys?: FeatureKey[];
};

export interface getSubProcessesResponse { 
    type: string;
    payload: InstanceExtendedWithSubProcesses[];
    meta: {
        arg: {
            processInstanceId: string;
        };
        requestId: string;
        requestStatus: 'fulfilled';
    }
}
