import { VFC } from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import styled from 'styled-components';

const StyledTitle = styled(DialogTitle)`
    && {
        padding-bottom: 2rem;
        font-size: 1.25rem;
    }
`;

interface Props {
    open: boolean;
    titleText: string;
    contentText: string;
    cancelButtonText: string;
    confirmButtonText: string;
    onCancel: () => void;
    onConfirm: () => void;
}

const LeavePrompt: VFC<Props> = ({
    open,
    titleText,
    contentText,
    cancelButtonText,
    confirmButtonText,
    onCancel,
    onConfirm,
}) => (
    <Dialog
        open={open}
        onClose={onCancel}
    >
        <StyledTitle>{titleText}</StyledTitle>
        <DialogContent>
            <DialogContentText>{contentText}</DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={onCancel}>{cancelButtonText}</Button>
            <Button onClick={onConfirm}>{confirmButtonText}</Button>
        </DialogActions>
    </Dialog>
);

export default LeavePrompt;
