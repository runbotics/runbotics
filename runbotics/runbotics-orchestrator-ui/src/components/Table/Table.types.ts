import { SxProps, Theme } from '@mui/system';
import { Column } from 'react-table';

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
    singleSelect?: boolean;
    autoHeight?: boolean;
}
