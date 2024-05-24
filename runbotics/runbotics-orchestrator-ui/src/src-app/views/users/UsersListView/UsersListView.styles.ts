import { Select, TextField } from '@mui/material';
import styled from 'styled-components';

export const StyledActionsContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
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
