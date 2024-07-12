import React, { VFC } from 'react';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { IconButton } from '@mui/material';

import useTranslations from '#src-app/hooks/useTranslations';

import { RowCustomExpandedSpan } from '../Table.styles';
import { TableRowExpanderProps } from '../Table.types';
import { SUBROW_INDENT_MULTIPLIER } from '../Table.utils';

const TableRowExpander: VFC<TableRowExpanderProps> = ({ row, handleClick }) => {
    const { translate } = useTranslations();
    const clickHandler = handleClick ? { onClick: () => handleClick(row) } : {};

    return (
        <RowCustomExpandedSpan
            isExpanded={row.isExpanded}
            depthIndent={row.depth * SUBROW_INDENT_MULTIPLIER}
            {...clickHandler}
        >
            <IconButton {...row.getToggleRowExpandedProps()} sx={{ width: '36px' }} title={translate('History.Table.Expand')}>
                <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
        </RowCustomExpandedSpan>
    );
};


export default TableRowExpander;
