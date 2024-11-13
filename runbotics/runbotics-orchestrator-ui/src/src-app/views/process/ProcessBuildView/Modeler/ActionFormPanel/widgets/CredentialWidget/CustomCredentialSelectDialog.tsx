import { FunctionComponent, useEffect, useMemo, useState } from 'react';

import { Done, Autorenew } from '@mui/icons-material';
import { Box, Button, Dialog, DialogActions, DialogTitle, Typography } from '@mui/material';
import { Show, If, Else } from 'multi-condition';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { ActionCredentialType, CredentialDto } from 'runbotics-common';

import CredentialSelectSet from '#src-app/components/CredentialSelectSet';
import { translate } from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';
import { credentialsSelector, credentialsActions } from '#src-app/store/slices/Credentials/Credentials.slice';
import { AddDialogContent, StyledButton } from '#src-app/views/process/ProcessConfigureView/ProcessCredentials/ProcessCredentials.styles';

interface CustomCredentialSelectDialogProps {
    isOpen: boolean;
    handleClose: () => void;
    templateName: string;
    credential: CredentialDto | string;
    credentialType: ActionCredentialType;
    setCredential: (credential: CredentialDto | string) => void;
}

export const CustomCredentialSelectDialog: FunctionComponent<CustomCredentialSelectDialogProps> = ({
    isOpen, handleClose, setCredential, credentialType, credential,
}) => {
    const { enqueueSnackbar } = useSnackbar();
    const { id: processId } = useRouter().query;
    const dispatch = useDispatch();
    const { allProcessAssigned } = useSelector(credentialsSelector);
    const [pickedCredential, setPickedCredential] = useState();
    const handleDialogClose = () => {
        handleClose();
    };
    const allProcessAssignedByType = useMemo(() => allProcessAssigned.filter(cred => cred.credential.template.name === credentialType), [allProcessAssigned, credentialType]);

    const handleCredentialChange = (selectedCredential) => {
        setPickedCredential(selectedCredential);
    };

    const handleSelectCredential = () => {
        setCredential(pickedCredential)
        handleClose();
    };

    useEffect(() => {
        if (isOpen) {
            dispatch(credentialsActions.fetchAllCredentialsAssignedToProcess({ resourceId: String(processId) }))
                .then(() => {
                    if (allProcessAssignedByType.length === 0) {
                        enqueueSnackbar(translate('Credential.ActionFormSelect.Dialog.NoCredentialsSpecified.Info'), { variant: 'info' });
                        handleClose();
                    }
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    return (
        <Dialog open={isOpen} fullWidth>
            <DialogTitle>
                <Typography variant='h5'>
                    {translate('Process.Configure.Credentials.Modal.Add.Title')}
                </Typography>
            </DialogTitle>
            <AddDialogContent>
                <CredentialSelectSet
                    credentials={allProcessAssignedByType.map(basicCredential => basicCredential.credential)}
                    handleCredentialChange={handleCredentialChange}
                />
            </AddDialogContent>
            <DialogActions>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', px: 1 }}>
                    <Show>
                        <If condition={!credential}>
                            <Button
                                disabled
                                variant='text'
                                onClick={() => {
                                    setCredential('');
                                    handleClose();
                                }}
                                startIcon={<Done />}
                            >
                                {translate('Credential.ActionFormSelect.Dialog.SetToPrimary.Label')}
                            </Button>
                        </If>
                        <Else>
                            <Button
                                variant='text'
                                onClick={() => {
                                    setCredential('');
                                    handleClose();
                                }}
                                startIcon={<Autorenew />}
                            >
                                {translate('Credential.ActionFormSelect.Dialog.ResetToPrimary.Label')}
                            </Button>
                        </Else>
                    </Show>
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
        </Dialog >
    );
};
