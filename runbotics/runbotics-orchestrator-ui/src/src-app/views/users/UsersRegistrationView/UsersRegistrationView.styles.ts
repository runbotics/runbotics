import { Button, TextField, Select, Box, InputLabel } from '@mui/material';
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

export const StyledButtonsContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    width: 40%;
`;

export const StyledButton = styled(Button)`
    width: 250px;
    && {
        margin-left: 20px;
    }
`;

export const DeleteButton = styled(Button)(({theme}) => `
    && {
        width: 250px;
        background-color: ${theme.palette.button.danger};
        color: ${theme.palette.background.default};

        && {
            margin-left: 20px;
        }

        &:hover {
            background-color: ${theme.palette.common.black};
        }
    }
`);

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
