/* eslint-disable max-lines-per-function */
import { FC, useEffect, useState } from 'react';

import { Grid, TextField, Typography, MenuItem, SelectChangeEvent } from '@mui/material';

import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import CustomDialog from '#src-app/components/CustomDialog';
import useTranslations from '#src-app/hooks/useTranslations';

import { useDispatch, useSelector } from '#src-app/store';
import { credentialCollectionsSelector } from '#src-app/store/slices/CredentialCollections';
import { credentialsActions } from '#src-app/store/slices/Credentials';
import { credentialTemplatesActions, credentialTemplatesSelector } from '#src-app/store/slices/CredentialTemplates';
import { Content, Form } from '#src-app/views/utils/FormDialog.styles';

import GeneralInfoDropdown from './CreateGeneralInfoDropdown';
import { CreateCredentialDto } from '../Credential.types';
import { getInitialCredentialData, getInitialFormValidationState, inputErrorMessages } from '../EditCredential/EditCredential.utils';

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

    const { credentialCollections } = useSelector(credentialCollectionsSelector);
    const { credentialTemplates } = useSelector(credentialTemplatesSelector);

    useEffect(() => {
        dispatch(credentialTemplatesActions.fetchAllTemplates());
    }, []);

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

    const collectionsToChoose = credentialCollections
        ? credentialCollections.map(collection => (
            <MenuItem key={collection.id} value={collection.id}>
                <Typography>{collection.name}</Typography>
            </MenuItem>
        ))
        : null;

    const templatesToChoose = credentialTemplates
        ? credentialTemplates.map(template => (
            <MenuItem key={template.id} value={template.id}>
                <Typography>{template.name}</Typography>
            </MenuItem>
        ))
        : null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setCredentialFormState(prevState => ({
            ...prevState,
            [name]: value
        }));

        setFormValidationState(prevState => ({
            ...prevState,
            [name]: value.trim() !== '',
            edited: true
        }));
    };

    const handleDropdownChange = (name: string, value: string) => {
        let changeTo = value;

        if (name === 'collectionId') {
            const foundCollection = credentialCollections.find(collection => collection.id === value);

            if (foundCollection) changeTo = foundCollection.id;
        }
        setCredentialFormState(prevState => ({
            ...prevState,
            [name]: changeTo
        }));
        setFormValidationState(prevState => ({
            ...prevState,
            [name]: changeTo !== ''
        }));
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
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={translate('Credential.Details.Name.Label')}
                                required
                                name="name"
                                InputLabelProps={{ shrink: true }}
                                value={credentialFormState.name}
                                onChange={handleInputChange}
                                error={formValidationState.edited && !formValidationState.name}
                                helperText={formValidationState.edited && !formValidationState.name && inputErrorMessages.NAME_IS_REQUIRED}
                            ></TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={translate('Credential.Details.Description.Label')}
                                multiline
                                name="description"
                                value={credentialFormState.description}
                                onChange={handleInputChange}
                            ></TextField>
                        </Grid>
                        <Grid item xs={12} mt={2}>
                            <GeneralInfoDropdown
                                disabled={!!collectionId}
                                selectLabel={translate('Credentials.Tab.Collections')}
                                tooltipText={translate('Credential.Details.Disclaimer.Text')}
                                selectOptions={collectionsToChoose}
                                selectedValue={credentialFormState.collectionId}
                                handleChange={(event: SelectChangeEvent) => handleDropdownChange('collectionId', event.target.value)}
                                required
                                error={formValidationState.edited && !formValidationState.collectionId}
                                helperText={formValidationState.edited && inputErrorMessages.COLLECTION_IS_REQUIRED}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <GeneralInfoDropdown
                                disabled={false}
                                selectLabel={translate('Credential.Details.Template.Label')}
                                tooltipText={translate('Credential.Details.Template.Info')}
                                selectOptions={templatesToChoose}
                                selectedValue={credentialFormState.templateId}
                                handleChange={(event: SelectChangeEvent) => handleDropdownChange('templateId', event.target.value)}
                                required
                                error={formValidationState.edited && !formValidationState.templateId}
                                helperText={formValidationState.edited && inputErrorMessages.TEMPLATE_IS_REQUIRED}
                            />
                        </Grid>
                    </Grid>
                </Form>
            </Content>
        </CustomDialog>
    );
};

export default CreateGeneralInfoFormDialog;
