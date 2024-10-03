import { FunctionComponent, useEffect, useState } from 'react';


import { Dialog, DialogActions, DialogTitle, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { CredentialDto } from 'runbotics-common';

import CredentialSelectSet from '#src-app/components/CredentialSelectSet';
import If from '#src-app/components/utils/If';
import { translate } from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';
import { credentialsActions, credentialsSelector } from '#src-app/store/slices/Credentials/Credentials.slice';
import { processActions } from '#src-app/store/slices/Process';

import { AddDialogContent, StyledButton } from './ProcessCredentials.styles';


interface ProcessCredentialsAddDialogProps {
    isOpen: boolean;
    handleClose: () => void;
    templateName: string;
}

export const ProcessCredentialsAddDialog: FunctionComponent<ProcessCredentialsAddDialogProps> = ({
    isOpen, handleClose, templateName
}) => {
    const { enqueueSnackbar } = useSnackbar();
    const { id: processId } = useRouter().query;
    const dispatch = useDispatch();
    const { allByTemplateAndProcess } = useSelector(credentialsSelector);
    const [pickedCredential, setPickedCredential] = useState<CredentialDto>();

    const handleDialogClose = () => {
        setPickedCredential(undefined);
        handleClose();
    };

    const handleCredentialChange = (credential) => {
        setPickedCredential(credential);
    };

    const handleAddCredential = () => {
        const payload = {
            processId: String(processId),
            credentialId: pickedCredential.id,
            templateName
        };

        dispatch(processActions.createProcessCredential({ payload }))
            .unwrap()
            .then(() => {
                enqueueSnackbar(
                    translate('Process.Configure.Credentials.Modal.Add.Info.Success'),
                    { variant: 'success' }
                );
                setPickedCredential(undefined);
                dispatch(processActions.getProcessCredentials({ resourceId: String(processId) }));
                handleClose();
            })
            .catch(() => {
                enqueueSnackbar(
                    translate('Process.Configure.Credentials.Modal.Add.Info.Error'),
                    { variant: 'error' }
                );
                handleClose();
            });
    };

    useEffect(() => {
        if (isOpen) {
            dispatch(credentialsActions.fetchAllCredentialsByTemplateAndProcess({
                pageParams: { templateName, processId }
            }));
        }
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
                        credentials={allByTemplateAndProcess}
                        handleCredentialChange={handleCredentialChange}
                    />
                </AddDialogContent>
                <DialogActions>
                    <StyledButton onClick={handleDialogClose}>
                        {translate('Common.Close')}
                    </StyledButton>
                    <StyledButton
                        variant='contained'
                        onClick={handleAddCredential}
                        disabled={!pickedCredential}
                    >
                        {translate('Process.Configure.Credentials.Modal.Add.Button.Add')}
                    </StyledButton>
                </DialogActions>
            </Dialog>
        </If>
    );
};
