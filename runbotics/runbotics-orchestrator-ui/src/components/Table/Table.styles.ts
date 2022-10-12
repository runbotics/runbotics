import styled, { css } from 'styled-components';
import { TableRow } from '@mui/material';
import { TABLE_ROW_HEIGHT } from './Table.utils';

export const RowsSelectWrapper = styled.div`
    position: absolute;
    left: 0;
    display: flex;
    align-items: center;
`;

export const RowCustomExpandedSpan = styled.span<{ isExpanded: boolean }>`
    & > button > svg {
        transform: ${({ isExpanded }) => (isExpanded ? 'rotate(90deg)' : 'rotate(0)')};
        transition: transform 0.3s ease-out;
    }
`;

export const DataTableWrapper = styled.div(({ theme }) => `
    padding: 0.5rem;
    width: 100%;
    background-color: ${theme.palette.background.paper};
    box-shadow: ${theme.shadows[2]};
`);

const subRowStyles = css<{ isRowSelected?: boolean, isClickable?: boolean }>`
    background-color: ${(p) => (p.isRowSelected ? p.theme.palette.action.selected : p.theme.palette.grey[100])};

    &:hover {
        cursor: ${(p) => (p.isClickable ? 'pointer' : 'normal')};
        background-color: ${(p) => p.theme.palette.action.hover};
    }
`;

const rowStyles = css<{ isRowSelected?: boolean, isClickable?: boolean }>`
    ${(p) => p.isRowSelected && `background-color: ${p.theme.palette.action.selected}`};

    &:hover {
        cursor: ${(p) => (p.isClickable ? 'pointer' : 'normal')};
        background-color: ${(p) => p.theme.palette.action.hover};
    }
`;

export const DataTableRow = styled(TableRow) <{
    isRowSelected?: boolean, isSubRoww: boolean, isClickable?: boolean,
}>`
    && {
        min-height: ${TABLE_ROW_HEIGHT}px;
    }

    ${(p) => (p.isSubRoww ? subRowStyles : rowStyles)};

    & > :first-child {
        cursor: default;
    }
`;
