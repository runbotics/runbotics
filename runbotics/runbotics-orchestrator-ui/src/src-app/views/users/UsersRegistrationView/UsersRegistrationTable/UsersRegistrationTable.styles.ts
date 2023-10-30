import { Select } from '@mui/material';
import { styled } from '@mui/system';

export const DataGridStyle = {
    '& .MuiDataGrid-cell:nth-of-type(4)': {
        padding: 0
    },
    '& .MuiDataGrid-cell:focus': {
        outline: 0,
    },
    '& .MuiDataGrid-cell:focus-within': {
        outline: 0,
    }
};

export const StyledSelect = styled(Select)`
    & .MuiSelect-select {
        padding: 17px;

        &:focus {
            background-color: transparent;
        }
    }

    && {
        background-color: inherit;
    }
`;
