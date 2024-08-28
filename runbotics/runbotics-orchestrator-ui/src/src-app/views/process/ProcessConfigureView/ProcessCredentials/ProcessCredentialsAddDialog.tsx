import { FunctionComponent, useEffect, useState } from 'react';

import { Dialog, DialogActions, DialogTitle, Typography } from '@mui/material';
import { useRouter } from 'next/router';

import CredentialSelectSet from '#src-app/components/CredentialSelectSet';
import If from '#src-app/components/utils/If';
import { translate } from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';
import { Credential } from '#src-app/store/slices/Credentials';
import { credentialsActions, credentialsSelector } from '#src-app/store/slices/Credentials/Credentials.slice';

import { AddDialogContent, StyledButton } from './ProcessCredentials.styles';


interface ProcessCredentialsAddDialogProps {
    isOpen: boolean;
    handleClose: () => void;
    templateName: string;
}

export const ProcessCredentialsAddDialog: FunctionComponent<ProcessCredentialsAddDialogProps> = ({
    isOpen, handleClose, templateName
}) => {
    const { id: processId } = useRouter().query;
    const dispatch = useDispatch();
    const { all } = useSelector(credentialsSelector);
    const [pickedCredential, setPickedCredential] = useState<Credential | undefined>();

    const handleCredentialChange = (credential: Credential | undefined) => {
        setPickedCredential(credential);
    };

    const handleCredentialAdd = () => {
        // here api
    };

    useEffect(() => {
        if (isOpen) {
            dispatch(credentialsActions.getAllForProcessAndTemplate({
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
                        credentials={all ?? []}
                        handleCredentialChange={handleCredentialChange}
                    />
                </AddDialogContent>
                <DialogActions>
                    <StyledButton onClick={handleClose}>
                        {translate('Common.Close')}
                    </StyledButton>
                    <StyledButton
                        variant='contained'
                        onClick={handleCredentialAdd}
                        disabled={!pickedCredential}
                    >
                        {translate('Process.Configure.Credentials.Modal.Add.Button.Add')}
                    </StyledButton>
                </DialogActions>
            </Dialog>
        </If>
    );
};
