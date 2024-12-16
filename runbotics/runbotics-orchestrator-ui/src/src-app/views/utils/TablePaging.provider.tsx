import { createContext, FC } from 'react';

export const AVAILABLE_ROWS_PER_PAGE = [10, 20, 30];

const DEFAULT_PAGE_SIZE = 10;
const INITIAL_PAGE = 0;

interface TablePagingValues {
    pageSize: number;
    page: number;
}

export const DEFAULT_TABLE_PAGING_VALUES = {
    pageSize: DEFAULT_PAGE_SIZE,
    page: INITIAL_PAGE
};

export const TablePagingContext = createContext(DEFAULT_TABLE_PAGING_VALUES);

interface TablePagingProps extends TablePagingValues {
    [key: string]: any;
}

const TablePagingProvider: FC<TablePagingProps> = ({ children, page, pageSize, ...rest }) => (
    <TablePagingContext.Provider value={{page, pageSize, ...rest}}>
        {children}
    </TablePagingContext.Provider>
);

export default TablePagingProvider;
