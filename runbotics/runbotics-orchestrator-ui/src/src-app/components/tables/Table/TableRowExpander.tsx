import React, { VFC } from 'react';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { IconButton } from '@mui/material';

import useTranslations from '#src-app/hooks/useTranslations';

import { RowCustomExpandedSpan } from './Table.styles';
import { TableRowExpanderProps } from './Table.types';

const TableRowExpander: VFC<TableRowExpanderProps> = ({ row, handleClick }) => {
    const { translate } = useTranslations();
    return (
        <RowCustomExpandedSpan isExpanded={row.isExpanded} depth={row.depth} onClick={() => handleClick(row)}>
            <IconButton {...row.getToggleRowExpandedProps()} sx={{ width: '36px' }} title={translate('History.Table.Expand')}>
                <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
        </RowCustomExpandedSpan>
    );
};


export default TableRowExpander;
