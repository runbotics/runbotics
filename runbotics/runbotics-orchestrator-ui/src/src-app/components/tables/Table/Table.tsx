/* eslint-disable max-lines-per-function */
import React, { useEffect, useMemo, useState } from 'react';

import {
    Table as MuiTable,
    CircularProgress,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Grid,
    Box,
} from '@mui/material';
import { Row, useExpanded, useRowSelect, useTable } from 'react-table';

import useTranslations from '#src-app/hooks/useTranslations';

import BlankRow from './components/BlankRow';
import { LoadMore } from './components/LoadMore';
import DataTableFooter from './Table.footer';
import { DataTableRow, DataTableWrapper, LoadingRow } from './Table.styles';
import { DataTableProps, DataRow } from './Table.types';
import { TABLE_PAGE_SIZES, TABLE_ROW_HEIGHT, INTERACTIVE_COLUMNS, calcPage, getEndedBranches, getRowsToInsert, getNthId, getRowId, getSpecialRows, LOAD_MORE_SUBPROCESSES_PAGE_SIZE } from './Table.utils';
import If from '../../utils/If';
import { ProcessInstanceRow } from '../HistoryTable/HistoryTable.types';
import { COLUMNS_NUMBER } from '../HistoryTable/HistoryTable.utils';


const Table = <T extends object>({
    columns,
    data: propData,
    totalPages,
    onRowClick,
    setPage,
    setPageSize: propSetPageSize,
    pageSize: propPageSize,
    page,
    loading,
    subRowProperty,
    singleSelect,
    autoHeight,
    instanceId,
    getSubprocessesPage,
}: DataTableProps<T>) => {
    const [isLoading, setIsLoading] = useState(true);
    const [pageSize, setPageSize] = useState(propPageSize);
    const { translate } = useTranslations();

    useEffect(() => {
        setIsLoading(loading);
    }, [loading]);

    const replaceKeyRecursive = (tableData: T | T[], newKey: string) => {
        if (typeof tableData !== 'object' || tableData === null) {
            return tableData;
        }

        if (Array.isArray(tableData)) {
            return tableData.map(item => replaceKeyRecursive(item, newKey));
        }

        const newObj = {};

        for (const key in tableData) {
            if (Object.hasOwnProperty.call(tableData, key)) {
                const newKeyString = key === subRowProperty ? newKey : key;
                newObj[newKeyString] = replaceKeyRecursive(tableData[key] as T[], newKey);
            }
        }

        return newObj;
    };

    const data = useMemo(() => {
        if (subRowProperty) {
            return replaceKeyRecursive(propData, 'subRows');
        }
        return propData;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [propData]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        toggleAllRowsSelected,
        toggleRowSelected,
    } = useTable<T>(
        {
            columns,
            data,
            initialState: { pageIndex: 0 },
            manualPagination: true,
            autoResetExpanded: false,
        },
        useExpanded,
        useRowSelect,
    );

    const mappedRows = useMemo(() => {
        if (!instanceId) return rows;
        return rows.map((row: (Row<T> & { original: { id: string } })) => {
            if (row.original.id === instanceId) {
                return {
                    ...row,
                    isSelected: true,
                };
            }
            return row;
        });
    }, [rows, instanceId]);


    useEffect(() => {
        setPageSize(propPageSize);
    }, [propPageSize]);

    useEffect(() => {
        if (mappedRows.length !== pageSize) setPageSize(mappedRows.length);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mappedRows.length]);

    const handleRowClick = (row: Row<T>) => {
        if (onRowClick) onRowClick(row.original);
        if (singleSelect) {
            toggleAllRowsSelected(false);
            toggleRowSelected(row.id, true);
        }
    };

    const renderCells = (row: Row<T>) =>
        row.cells.map((cell) => (
            // eslint-disable-next-line react/jsx-key
            <TableCell
                {...cell.getCellProps()}
                onClick={
                    !INTERACTIVE_COLUMNS.includes(cell.column.id) ? () => handleRowClick(row) : undefined
                }
                sx={cell.column.id === 'expander' ? { padding: '11px 16px' } : undefined}
            >
                <>{cell.render('Cell')}</>
            </TableCell>
        ));

    const rowLoader = (
        <TableRow>
            <TableCell colSpan={columns.length ?? COLUMNS_NUMBER} sx={{ height: `${TABLE_ROW_HEIGHT}px`}}>
                <LoadingRow />
            </TableCell>
        </TableRow>
    );


    const renderTableRows = () => {
        const dataRows: DataRow[] = mappedRows
            .map((row: Row<T>) => {
                prepareRow(row);
                const rowKey = row.getRowProps().key;
                const canLoadMore = row.isExpanded && (row as ProcessInstanceRow).original?.subprocessesCount > row.subRows.length;
                const isRowLoading = row.isExpanded && (row as ProcessInstanceRow).original?.isLoadingSubprocesses;
                const loaderOrLoadMore = isRowLoading
                    ? rowLoader
                    : canLoadMore &&
                    <LoadMore
                        row={row as ProcessInstanceRow}
                        getSubprocessesPage={getSubprocessesPage}
                        pageNum={calcPage(row.subRows.length, LOAD_MORE_SUBPROCESSES_PAGE_SIZE)}
                        size={LOAD_MORE_SUBPROCESSES_PAGE_SIZE}
                        columnsNum={columns.length}
                    />;

                const createdRow = (
                    <React.Fragment key={rowKey}>
                        <DataTableRow
                            key={row.id}
                            $isClickable={Boolean(onRowClick)}
                            $isRowSelected={row.isSelected}
                            $isSubRow={row.depth > 0}
                        >
                            {renderCells(row)}
                        </DataTableRow>
                    </React.Fragment>
                );

                return ({
                    createdRow,
                    loaderOrLoadMore,
                });
            });

        const blankRow = <BlankRow key={-1} />;

        const orderedRows = [...dataRows, { createdRow: blankRow, loaderOrLoadMore: false }].reduce((acc, { createdRow: currRow }) => {
            const prevRow = acc.at(-1);

            if (!prevRow) {
                return [...acc, currRow];
            }

            const prevRowId = getNthId(acc, -1);
            const currRowId = getRowId(currRow) ?? '';

            if(!prevRowId) {
                return [...acc, currRow];
            }

            const endedBranches = getEndedBranches(prevRowId, currRowId);
            const rowsToInsert = getRowsToInsert(endedBranches, getSpecialRows(dataRows));

            return [...acc, ...rowsToInsert, currRow];
        }, []);

        if (autoHeight) return orderedRows;

        const blankRowsLength = TABLE_PAGE_SIZES[0] - orderedRows.length;
        const blankRows: JSX.Element[] = Array.from({ length: blankRowsLength }, (_, i) => <BlankRow key={i + 1} />);

        return [...orderedRows, ...blankRows];
    };

    const emptyDataElement = (
        <TableRow>
            <TableCell colSpan={columns.length ?? COLUMNS_NUMBER} align="center">
                <Grid item xs={12}>
                    {translate('Component.Table.NoDataFound')}
                </Grid>
            </TableCell>
        </TableRow>
    );

    const cellLoader = (
        <TableRow>
            <TableCell colSpan={columns.length ?? COLUMNS_NUMBER} sx={{ verticalAlign: 'middle' }}>
                <Box width="100%" display="flex" justifyContent="center">
                    <CircularProgress color="secondary" />
                </Box>
            </TableCell>
        </TableRow>
    );

    return (
        <DataTableWrapper>
            <TableContainer>
                <MuiTable {...getTableProps()} aria-label={translate('Component.Table.Table.AriaLabel')}>
                    <TableHead>
                        {headerGroups.map((headerGroup) => (
                            // eslint-disable-next-line react/jsx-key
                            <TableRow {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column, index) => (
                                    <TableCell
                                        // eslint-disable-next-line react/no-array-index-key
                                        key={index}
                                        {...column.getHeaderProps()}
                                        style={{ width: `${column.width}` || 'auto' }}
                                    >
                                        {column.render('Header')}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableHead>
                    <TableBody {...getTableBodyProps()}>
                        <If condition={!isLoading} else={cellLoader}>
                            <If condition={propData.length > 0} else={emptyDataElement}>
                                {renderTableRows()}
                            </If>
                        </If>
                    </TableBody>
                    {!!totalPages && !!pageSize && (
                        <DataTableFooter
                            sx={{
                                borderTop: (theme) =>
                                    TABLE_PAGE_SIZES[0] > mappedRows.length
                                        ? `1px solid ${theme.palette.grey[300]}`
                                        : undefined,
                            }}
                            pageCount={totalPages}
                            pageSize={propPageSize}
                            setPageSize={propSetPageSize}
                            page={page}
                            setPage={setPage}
                        />
                    )}
                </MuiTable>
            </TableContainer>
        </DataTableWrapper>
    );
};

export default Table;
