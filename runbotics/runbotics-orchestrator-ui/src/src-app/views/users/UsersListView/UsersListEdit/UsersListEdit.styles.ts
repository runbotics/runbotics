import { LoadingButton } from '@mui/lab';
import { Button, DialogActions } from '@mui/material';
import styled from 'styled-components';

export const StyledButton = styled(Button)`
    width: 80px;
    height: 40px;
`;

export const DeleteButton = styled(LoadingButton)(({theme}) => `
    && {
        background-color: ${theme.palette.grey.A700};
        color: ${theme.palette.error.contrastText};

        &:hover {
            background-color: ${theme.palette.common.black};
        }
    }
`);

export const StyledDialogActions = styled(DialogActions)`
    display: flex;
    justify-content: space-between !important;
`;
