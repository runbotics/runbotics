import styled from 'styled-components';

export const DataGridStyle = {
    '& .MuiDataGrid-cell:nth-of-type(4)': {
        padding: 0
    },
    '& .MuiDataGrid-row:hover': {
        cursor: 'pointer',
    },
    '& .MuiDataGrid-cell:focus': {
        outline: 0,
    }
};

export const StyledCell = styled.div`
    width: 400px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`;
