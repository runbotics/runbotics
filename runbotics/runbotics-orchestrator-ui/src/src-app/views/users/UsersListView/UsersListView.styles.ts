import { Box, InputLabel, Select, TextField } from '@mui/material';
import styled from 'styled-components';

export const StyledActionsContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 20px;
    align-items: center;
    margin: 20px 0;
`;

export const StyledTextField = styled(TextField)`
    width: 350px;
    && {
        margin: 0;
    }
`;

export const StyledSelect = styled(Select)`
    width: 300px;
    height: 40px;
`;

export const StyledSearchFilterBox = styled(Box)`
    display: flex;
    gap: 10px;
`;

export const StyledInputLabel = styled(InputLabel)(({ theme }) => `
    && {
        color: ${theme.palette.grey[700]};
    }
`);
