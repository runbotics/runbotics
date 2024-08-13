import { TextField, Button } from '@mui/material';
import styled from 'styled-components';

export const StyledActionsContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 20px 0;
`;

export const StyledTextField = styled(TextField)`
    width: 350px;
    && {
        margin: 0;
    }
`;

export const StyledButton = styled(Button)`
    width: 200px;
    && {
        margin-left: 20px;
    }
`;
