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

import DataTableFooter from './Table.footer';
import { DataTableRow, DataTableWrapper, LoadingRow } from './Table.styles';
import { DataTableProps } from './Table.types';
import { TABLE_PAGE_SIZES, TABLE_ROW_HEIGHT, INTERACTIVE_COLUMNS } from './Table.utils';
import If from '../../utils/If';
import { ProcessInstanceRow } from '../HistoryTable/HistoryTable.types';


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
    renderSubRow,
    singleSelect,
    autoHeight,
    instanceId,
}: DataTableProps<T>) => {
    const [isLoading, setIsLoading] = useState(true);
    const [pageSize, setPageSize] = useState(propPageSize);
    const { translate } = useTranslations();

    useEffect(() => {
        setIsLoading(loading);
    }, [loading]);

    const data = useMemo(() => {
        if (subRowProperty) return propData.map((row) => ({ ...row, subRows: row[subRowProperty] }));

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
              }
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

    const countExpandedRows = () => {
        let iterator = propPageSize;

        return mappedRows.reduce((acc, row) => {
            if (iterator <= 0 || row.depth > 0) return acc;
            iterator--;
            return acc + row.subRows.length + 1;
        }, 0);
    };

    const rowLoader = (
        <TableRow>
            <TableCell colSpan={columns.length ?? 7} sx={{ height: `${TABLE_ROW_HEIGHT}px`}}>
                <LoadingRow /> 
            </TableCell>
        </TableRow>
    );

    const renderTableRows = () => {
        const dataRows = mappedRows
            .slice(0, countExpandedRows())
            .map((row: Row<T>) => {
                prepareRow(row);
                const rowKey = row.getRowProps().key;
                return (
                    <React.Fragment key={rowKey}>
                        <DataTableRow
                            key={row.id}
                            $isClickable={Boolean(onRowClick)}
                            $isRowSelected={row.isSelected}
                            $isSubRow={row.depth > 0}
                        >
                            {renderCells(row)}
                        </DataTableRow>
                        {!!renderSubRow && row.isExpanded ? renderSubRow(row) : null}
                        {row.isExpanded && (row as ProcessInstanceRow).original?.isLoadingSubprocesses ? rowLoader : null}
                    </React.Fragment>
                );
            });
        if (autoHeight) return dataRows;

        const dummyRows: JSX.Element[] = [];
        const dummyRowsLength = TABLE_PAGE_SIZES[0] - dataRows.length;
        for (let i = dummyRowsLength; i > 0; i--) {
            dummyRows.push(
                <TableRow
                    key={`dummy-row-${i}`}
                    sx={{
                        minHeight: `${TABLE_ROW_HEIGHT}px`,
                        height: `${TABLE_ROW_HEIGHT}px`,
                    }}
                />,
            );
        }

        return [...dataRows, ...dummyRows];
    };

    const emptyDataElement = (
        <TableRow>
            <TableCell colSpan={columns.length ?? 7} align="center">
                <Grid item xs={12}>
                    {translate('Component.Table.NoDataFound')}
                </Grid>
            </TableCell>
        </TableRow>
    );

    const cellLoader = (
        <TableRow>
            <TableCell colSpan={columns.length ?? 7} sx={{ verticalAlign: 'middle' }}>
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
