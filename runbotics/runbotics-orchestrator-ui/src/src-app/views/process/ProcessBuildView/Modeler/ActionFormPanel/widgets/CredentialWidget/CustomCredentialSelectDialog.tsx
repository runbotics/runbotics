import { FunctionComponent, useEffect, useState } from 'react';

import { Box, Button, Dialog, DialogActions, DialogTitle, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { CredentialDto } from 'runbotics-common';

import CredentialSelectSet from '#src-app/components/CredentialSelectSet';
import If from '#src-app/components/utils/If';
import { translate } from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';
import { credentialsSelector, credentialsActions } from '#src-app/store/slices/Credentials/Credentials.slice';
import { AddDialogContent, StyledButton } from '#src-app/views/process/ProcessConfigureView/ProcessCredentials/ProcessCredentials.styles';

interface CustomCredentialSelectDialogProps {
    isOpen: boolean;
    handleClose: () => void;
    templateName: string;
    credential: CredentialDto | string;
    setCredential: (credential: CredentialDto | string) => void;
}

export const CustomCredentialSelectDialog: FunctionComponent<CustomCredentialSelectDialogProps> = ({
    isOpen, handleClose, setCredential
}) => {
    const { enqueueSnackbar } = useSnackbar();
    const { id: processId } = useRouter().query;
    const dispatch = useDispatch();
    const { allProcessAssigned: allAvailable } = useSelector(credentialsSelector);
    const [pickedCredential, setPickedCredential] = useState();
    const handleDialogClose = () => {
        handleClose();
    };

    const handleCredentialChange = (selectedCredential) => {
        setPickedCredential(selectedCredential);
    };

    const handleSelectCredential = () => {
        setCredential(pickedCredential);
        handleClose();
    };

    useEffect(() => {
        if (isOpen) {
            dispatch(credentialsActions.fetchAllCredentialsAssignedToProcess({ resourceId: String(processId) }))
                .then(() => {
                    if (allAvailable.length === 0) {
                        enqueueSnackbar('Credential.ActionFormSelect.Dialog.NoCredentialsSpecified.Info', { variant: 'info' });
                        handleClose();
                    }
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    return (
        <If condition={isOpen}>
            <Dialog open fullWidth>
                <DialogTitle>
                    <Typography variant='h5'>
                        {translate('Process.Configure.Credentials.Modal.Add.Title')}
                    </Typography>
                </DialogTitle>
                <AddDialogContent>
                    <CredentialSelectSet
                        credentials={allAvailable.map(basicCredential => basicCredential.credential)}
                        handleCredentialChange={handleCredentialChange}
                    />
                </AddDialogContent>
                <DialogActions>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', px: 1 }}><Button
                        variant='text'
                        onClick={() => {
                            setCredential('');
                            handleClose();
                        }}
                    >
                        {translate('Credential.ActionFormSelect.Dialog.ResetToPrimary.Label')}
                    </Button>
                    <Box sx={{ display: 'flex' }}>
                        <StyledButton onClick={handleDialogClose}>
                            {translate('Common.Close')}
                        </StyledButton>
                        <StyledButton
                            variant='contained'
                            onClick={handleSelectCredential}
                            disabled={!pickedCredential}
                        >
                            {translate('Process.Configure.Credentials.Modal.Add.Button.Add')}
                        </StyledButton>
                    </Box>
                    </Box>
                </DialogActions>
            </Dialog>
        </If>
    );
};
