import { ReactNode } from 'react';
import { Column, Row } from 'react-table';
import { SxProps, Theme } from '@mui/system';
import { FeatureKey } from 'runbotics-common';

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
    renderSubRow?: (row: Row<T>) => ReactNode;
    singleSelect?: boolean;
    autoHeight?: boolean;
}

export type ProcessInstanceColumn<D extends object = {}> = Column<D> & {
    featureKeys?: FeatureKey[];
};
