import { LinearProgress, TableRow } from '@mui/material';
import styled, { css } from 'styled-components';

import { TABLE_ROW_HEIGHT } from './Table.utils';

export const RowsSelectWrapper = styled.div`
    position: absolute;
    left: 0;
    display: flex;
    align-items: center;
`;

export const RowCustomExpandedSpan = styled.span<{ isExpanded: boolean, depthIndent: number }>`
    & > button > svg {
        transform: ${({ isExpanded }) => (isExpanded ? 'rotate(90deg)' : 'rotate(0)')};
        transition: transform 0.3s ease-out;
        max-width: unset;
    }

    padding-left: ${({ depthIndent }) => `${depthIndent}px`};
`;

export const DataTableWrapper = styled.div(({ theme }) => `
    padding: 0.5rem;
    width: 100%;
    background-color: ${theme.palette.background.paper};
    box-shadow: ${theme.shadows[2]};
`);

const subRowStyles = css<{ $isRowSelected?: boolean, $isClickable?: boolean }>`
    background-color: ${({ $isRowSelected, theme }) => ($isRowSelected
        ? theme.palette.action.selected
        : theme.palette.grey[100])};

    &:hover {
        cursor: ${({ $isClickable }) => ($isClickable ? 'pointer' : 'normal')};
        background-color: ${({ theme }) => theme.palette.action.hover};
    }
`;

const rowStyles = css<{ $isRowSelected?: boolean, $isClickable?: boolean }>`
    ${({ $isRowSelected, theme }) => $isRowSelected && `background-color: ${theme.palette.action.selected}`};

    &:hover {
        cursor: ${({ $isClickable }) => ($isClickable ? 'pointer' : 'normal')};
        background-color: ${({ theme }) => theme.palette.action.hover};
    }
`;

export const DataTableRow = styled(TableRow) <{
    $isRowSelected?: boolean, $isSubRow: boolean, $isClickable?: boolean,
}>`
    && {
        min-height: ${TABLE_ROW_HEIGHT}px;
    }

    ${({ $isSubRow }) => ($isSubRow ? subRowStyles : rowStyles)};

    & > :first-child {
        cursor: default;
    }
`;

export const LoadingRow = styled(LinearProgress)`
    && {
        width: 40%;
        margin: auto;
    }
`;
