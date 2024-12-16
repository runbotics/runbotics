import { FunctionComponent } from 'react';

import { Dialog, DialogActions, DialogTitle, Typography } from '@mui/material';

import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';

import { DeleteDialogContent, StyledButton } from './ProcessCredentials.styles';


interface ProcessCredentialsDeleteDialogProps {
    isOpen: boolean;
    handleClose: () => void;
    handleDelete: () => void;
}

export const ProcessCredentialsDeleteDialog: FunctionComponent<ProcessCredentialsDeleteDialogProps> = ({
    isOpen, handleClose, handleDelete
}) => {
    const { translate } = useTranslations();

    return (
        <If condition={isOpen}>
            <Dialog open fullWidth>
                <DialogTitle>
                    <Typography variant='h5'>
                        {translate('Process.Configure.Credentials.Modal.Delete.Title')}
                    </Typography>
                </DialogTitle>
                <DeleteDialogContent>
                    <Typography>
                        {translate('Process.Configure.Credentials.Modal.Delete.Content')}
                    </Typography>
                </DeleteDialogContent>
                <DialogActions>
                    <StyledButton onClick={handleClose}>
                        {translate('Common.Close')}
                    </StyledButton>
                    <StyledButton onClick={handleDelete} variant='contained'>
                        {translate('Common.Delete')}
                    </StyledButton>
                </DialogActions>
            </Dialog>
        </If>
    );
};
