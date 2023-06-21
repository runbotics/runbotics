import React, { VFC } from 'react';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { IconButton } from '@mui/material';

import { RowCustomExpandedSpan } from './Table.styles';
import { TableRowExpanderProps } from './Table.types';

const TableRowExpander: VFC<TableRowExpanderProps> = ({ row, handleClick }) => (
    <RowCustomExpandedSpan isExpanded={row.isExpanded} onClick={() => handleClick(row)}>
        <IconButton {...row.getToggleRowExpandedProps()} sx={{ width: '36px' }}>
            <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
    </RowCustomExpandedSpan>
);

export default TableRowExpander;
