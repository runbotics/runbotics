import React, { ChangeEvent, FC } from 'react';

import {
    Box,
    FormControl,
    MenuItem,
    Pagination,
    Select,
    TableCell,
    TableFooter,
    TableRow,
    Typography,
} from '@mui/material';

import useTranslations from 'src/hooks/useTranslations';

import { RowsSelectWrapper } from './Table.styles';
import { DataTableFooterProps } from './Table.types';
import { TABLE_PAGE_SIZES } from './Table.utils';

const DataTableFooter: FC<DataTableFooterProps> = ({ pageCount, pageSize, setPageSize, page, setPage, sx }) => {
    const { translate } = useTranslations();

    const handleRowsPerPageChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPageSize(Number(e.target.value));
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value - 1);
    };

    const renderPageSizeMenuItems = () =>
        TABLE_PAGE_SIZES.map((item, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <MenuItem value={item} key={index}>
                {item}
            </MenuItem>
        ));

    return (
        <TableFooter>
            <TableRow>
                <TableCell colSpan={10} sx={{ borderBottom: 'none', ...sx }}>
                    <Box width="100%" display="flex" alignItems="center" position="relative" padding="1.25rem 0">
                        <RowsSelectWrapper>
                            <Typography variant="h6">{translate('Component.Table.RowsPerPage')}</Typography>
                            <FormControl variant="standard" size="small" sx={{ minWidth: 50, marginLeft: 3 }}>
                                <Select id="rosPerPage" value={pageSize} onChange={handleRowsPerPageChange}>
                                    {renderPageSizeMenuItems()}
                                </Select>
                            </FormControl>
                        </RowsSelectWrapper>
                        <Box display="flex" width="100%" justifyContent="center">
                            <Pagination count={pageCount} page={page + 1} onChange={handlePageChange} />
                        </Box>
                    </Box>
                </TableCell>
            </TableRow>
        </TableFooter>
    );
};

export default DataTableFooter;
