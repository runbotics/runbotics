import { Button, TextField } from '@mui/material';
import styled from 'styled-components';

export const StyledActionsContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 20px 0 20px 0;
`;

export const StyledTextField = styled(TextField)`
    width: 350px;
    margin: 0 !important;
`;

export const StyledButtonsContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    width: 40%;
`;

export const StyledButton = styled(Button)`
    display: flex;
    width: 250px;
    margin-left: 20px !important;
`;
