import { FunctionComponent } from 'react';

import { Dialog, DialogActions, DialogTitle, Typography } from '@mui/material';

import CredentialSelectSet from '#src-app/components/CredentialSelectSet';
import If from '#src-app/components/utils/If';

import { AddDialogContent, StyledButton } from './ProcessCredentials.styles';


interface ProcessCredentialsAddDialogProps {
    isOpen: boolean;
    handleClose: () => void;
}

export const ProcessCredentialsAddDialog: FunctionComponent<ProcessCredentialsAddDialogProps> = ({
    isOpen, handleClose
}) => {
    const x = 1;

    return (
        <If condition={isOpen}>
            <Dialog open fullWidth>
                <DialogTitle>
                    <Typography variant='h5'>
                        Add new credential for action
                    </Typography>
                </DialogTitle>
                <AddDialogContent>
                    <CredentialSelectSet
                        authors={[]}
                        credentials={[]}
                    />
                </AddDialogContent>
                <DialogActions>
                    <StyledButton onClick={handleClose}>Close</StyledButton>
                    <StyledButton variant='contained'>Add</StyledButton>
                </DialogActions>
            </Dialog>
        </If>
    );
};
