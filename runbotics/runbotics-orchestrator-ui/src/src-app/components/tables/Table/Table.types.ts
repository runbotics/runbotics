import { ReactNode } from 'react';

import { SxProps, Theme } from '@mui/system';
import { Column as ReactTableColumn, Row } from 'react-table';
import { FeatureKey } from 'runbotics-common';

import { GetSubprocessesPageParams, ProcessInstanceRow } from '../HistoryTable/HistoryTable.types';


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
    instanceId?: string;
    getSubprocessesPage?: (params: GetSubprocessesPageParams) => void;
}

export interface TableRowExpanderProps {
    row: Row;
    handleClick?: (row: ProcessInstanceRow) => void;
}

export type Column<D extends object = {}> = ReactTableColumn<D> & {
    featureKeys?: FeatureKey[];
};

export interface LoadMoreProps {
    row: ProcessInstanceRow;
    pageNum: number;
    size: number;
    columnsNum: number;
    getSubprocessesPage: (params: GetSubprocessesPageParams) => void;
}

export interface SpecialRow {
    key: string;
    loaderOrLoadMore: JSX.Element;
}

export interface EndedBranch {
    index: number;
    changedId: string;
    id: string;
}

export interface DataRow {
    createdRow: JSX.Element;
    loaderOrLoadMore: JSX.Element;
}
