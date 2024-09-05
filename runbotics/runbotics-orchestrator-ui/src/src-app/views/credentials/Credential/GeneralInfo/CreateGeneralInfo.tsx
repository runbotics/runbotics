/* eslint-disable max-lines-per-function */
import React, { FC, useState } from 'react';

import { Grid, TextField, Typography, MenuItem, SelectChangeEvent } from '@mui/material';

import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import CustomDialog from '#src-app/components/CustomDialog';
import useTranslations from '#src-app/hooks/useTranslations';

import { useDispatch, useSelector } from '#src-app/store';
import { credentialsActions } from '#src-app/store/slices/Credentials';
import { Content, Form } from '#src-app/views/utils/FormDialog.styles';


import GeneralInfoDropdown from './GeneralInfoDropdown';
import { CreateCredentialDto } from '../Credential.types';
import { getInitialCredentialData } from '../EditCredential/EditCredential.utils';

interface CreateGeneralInfoProps {
    onClose: () => void;
    open?: boolean;
}

export const CreateGeneralInfo: FC<CreateGeneralInfoProps> = ({ onClose, open }) => {
    const { translate } = useTranslations();
    const dispatch = useDispatch();
    const router = useRouter();
    const collectionId = router.query.collectionId ? router.query.collectionId as string : null;
    const [credentialFormState, setCredentialFormState] = useState<CreateCredentialDto>(getInitialCredentialData(collectionId));
    const [formValidationState, setFormValidationState] = useState<{ [key: string]: boolean }>({
        name: false,
        collectionId: collectionId ? true : false,
        templateId: false
    });
    const checkIsFormValid = () => Object.values(formValidationState).every(Boolean);
    const { enqueueSnackbar } = useSnackbar();
    const credentialsCollections = useSelector(state => state.credentialCollections.credentialCollections);
    const credentialTemplates = useSelector(state => state.credentialTemplates.data);

    const closeDialog = () => {
        onClose();
    };

    const handleSubmit = async () => {
        if (!checkIsFormValid()) {
            enqueueSnackbar('Invalid form values', { variant: 'error' });
            return;
        }

        await dispatch(
            credentialsActions.createCredential({
                resourceId: `${credentialFormState.collectionId}/credentials`,
                payload: {
                    name: credentialFormState.name,
                    description: credentialFormState.description,
                    templateId: credentialFormState.templateId,
                }
            })
        ).unwrap().then((response) => {
            router.push(`/app/credentials/${response.id}`);
            // add info about redirecting to credential page
            // close dialog
            // clear form
        }).catch((error) => {
            enqueueSnackbar(error.message, { variant: 'error' });
        });


    };

    const collectionsToChoose = credentialsCollections.map(collection => (
        <MenuItem key={collection.id} value={collection.id}>
            <Typography>{collection.name}</Typography>
        </MenuItem>
    ));

    const templatesToChoose = credentialTemplates.map(template => (
        <MenuItem key={template.id} value={template.id}>
            <Typography>{template.name}</Typography>
        </MenuItem>
    ));

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentialFormState(prevState => ({
            ...prevState,
            [name]: value
        }));
        setFormValidationState(prevState => ({
            ...prevState,
            [name]: value.trim() !== ''
        }));
    };

    const handleDropdownChange = (name: string, value: string) => {
        let changeTo = value;

        if (name === 'collectionId') {
            const foundCollection = credentialsCollections.find(collection => collection.id === value);

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
                    <Grid container spacing={5}>
                        <Grid item xs={12} sx={{ marginBottom: '-16px' }}>
                            <Typography variant="h5">{translate('Credential.GeneralInfo.Title')}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={translate('Credential.Details.Name.Label')}
                                required
                                name="name"
                                value={credentialFormState.name}
                                onChange={handleInputChange}
                            ></TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={translate('Credential.Details.Description.Label')}
                                multiline
                                required
                                name="description"
                                value={credentialFormState.description}
                                onChange={handleInputChange}
                            ></TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <GeneralInfoDropdown
                                disabled={!!collectionId}
                                selectLabel={translate('Credentials.Tab.Collections')}
                                tooltipText={translate('Credential.Details.Disclaimer.Text')}
                                selectOptions={collectionsToChoose}
                                selectedValue={credentialFormState.collectionId}
                                handleChange={(event: SelectChangeEvent) => handleDropdownChange('collectionId', event.target.value)}
                                required
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
                            />
                        </Grid>
                    </Grid>
                </Form>
            </Content>
        </CustomDialog>
    );
};
