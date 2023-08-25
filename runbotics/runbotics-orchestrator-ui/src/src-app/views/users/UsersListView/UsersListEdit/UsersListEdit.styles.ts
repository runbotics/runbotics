import { LoadingButton } from '@mui/lab';
import { Button, DialogActions } from '@mui/material';
import styled from 'styled-components';

export const StyledButton = styled(Button)`
    width: 80px;
`;

export const DeleteButton = styled(LoadingButton)(({theme}) => `
    && {
        background-color: ${theme.palette.button.danger};
        color: ${theme.palette.background.default};

        &:hover {
            background-color: ${theme.palette.common.black};
        }
    }
`);

export const StyledDialogActions = styled(DialogActions)`
    display: flex;
    && {
        justify-content: space-between;
    }
`;
