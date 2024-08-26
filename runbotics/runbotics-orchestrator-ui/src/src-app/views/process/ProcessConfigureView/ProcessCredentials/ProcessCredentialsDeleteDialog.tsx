import { FunctionComponent } from 'react';

import { Dialog, DialogActions, DialogTitle, Typography } from '@mui/material';

import If from '#src-app/components/utils/If';

import { Content, StyledButton } from './ProcessCredentials.styles';


interface ProcessCredentialsDeleteDialogProps {
    isOpen: boolean;
    handleClose: () => void;
    handleDelete: () => void;
}

export const ProcessCredentialsDeleteDialog: FunctionComponent<ProcessCredentialsDeleteDialogProps> = ({
    isOpen, handleClose, handleDelete
}) => {
    const x = 1;

    return (
        <If condition={isOpen}>
            <Dialog open fullWidth>
                <DialogTitle>
                    <Typography variant='h5'>
                        Delete process credential
                    </Typography>
                </DialogTitle>
                <Content>
                    Delete credential in process
                </Content>
                <DialogActions>
                    <StyledButton onClick={handleClose}>Close</StyledButton>
                    <StyledButton onClick={handleDelete} variant='contained'>Delete</StyledButton>
                </DialogActions>
            </Dialog>
        </If>
    );
};
