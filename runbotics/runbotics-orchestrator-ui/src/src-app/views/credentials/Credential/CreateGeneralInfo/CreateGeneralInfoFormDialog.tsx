import { FC, useState } from 'react';

import { Grid, Typography } from '@mui/material';

import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import CustomDialog from '#src-app/components/CustomDialog';
import useTranslations from '#src-app/hooks/useTranslations';

import { useDispatch } from '#src-app/store';
import { credentialsActions } from '#src-app/store/slices/Credentials';
import { Content, Form } from '#src-app/views/utils/FormDialog.styles';

import { GeneralInfoSelectFields } from './GeneralInfoSelectFields';
import { GeneralInfoTextFields } from './GeneralInfoTextInputs';
import { CreateCredentialDto } from '../Credential.types';
import {
    getInitialCredentialData,
    getInitialFormValidationState
} from '../EditCredential/EditCredential.utils';

interface CreateGeneralInfoProps {
    onClose: () => void;
    open: boolean;
}

const CreateGeneralInfoFormDialog: FC<CreateGeneralInfoProps> = ({ onClose, open }) => {
    const { translate } = useTranslations();
    const dispatch = useDispatch();
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const collectionId = router.query.collectionId ? (router.query.collectionId as string) : null;

    const [credentialFormState, setCredentialFormState] = useState<CreateCredentialDto>(getInitialCredentialData(collectionId));
    const [formValidationState, setFormValidationState] = useState(getInitialFormValidationState(collectionId));

    const isFormValid = () => Object.values(formValidationState).every(Boolean);

    const closeDialog = () => {
        onClose();
        clearForm();
    };

    const clearForm = () => {
        setCredentialFormState(getInitialCredentialData(collectionId));
        setFormValidationState(getInitialFormValidationState(collectionId));
    };

    const handleSubmit = () => {
        if (!isFormValid()) {
            setFormValidationState(prevValues => ({ ...prevValues, edited: true }));
            enqueueSnackbar(translate('Credential.Add.ValidationFail.Info'), { variant: 'error' });
            return;
        }

        dispatch(
            credentialsActions.createCredential({
                resourceId: `${credentialFormState.collectionId}/credentials`,
                payload: {
                    name: credentialFormState.name,
                    description: credentialFormState.description,
                    templateId: credentialFormState.templateId
                }
            })
        )
            .unwrap()
            .then(response => {
                router.push(`/app/credentials/${response.id}`);
                enqueueSnackbar(translate('Credential.Add.Success.RediectInfo'), { variant: 'success' });
                closeDialog();
            })
            .catch(error => {
                enqueueSnackbar(error.message, { variant: 'error' });
            });
    };

    return (
        <CustomDialog
            isOpen={open}
            onClose={closeDialog}
            title={translate('Credential.Dialog.Modify.Create.Title')}
            confirmButtonOptions={{
                label: translate('Common.Save'),
                onClick: handleSubmit
            }}
            cancelButtonOptions={{
                onClick: closeDialog
            }}
        >
            <Content sx={{ overflowX: 'hidden' }}>
                <Form>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h5">{translate('Credential.GeneralInfo.Title')}</Typography>
                        </Grid>
                        <GeneralInfoTextFields
                            credentialFormState={credentialFormState}
                            setCredentialFormState={setCredentialFormState}
                            formValidationState={formValidationState}
                            setFormValidationState={setFormValidationState}
                        />
                        <GeneralInfoSelectFields
                            collectionId={collectionId}
                            credentialFormState={credentialFormState}
                            setCredentialFormState={setCredentialFormState}
                            formValidationState={formValidationState}
                            setFormValidationState={setFormValidationState}
                        />
                    </Grid>
                </Form>
            </Content>
        </CustomDialog>
    );
};

export default CreateGeneralInfoFormDialog;
