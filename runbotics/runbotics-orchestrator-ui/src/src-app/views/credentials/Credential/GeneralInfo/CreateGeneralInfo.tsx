import React, { FC, useState } from 'react';

import { Grid, TextField, Typography, MenuItem, SelectChangeEvent } from '@mui/material';

import { useSnackbar } from 'notistack';

import CustomDialog from '#src-app/components/CustomDialog';
import useTranslations from '#src-app/hooks/useTranslations';

import { Content, Form } from '#src-app/views/utils/FormDialog.styles';

import { CreateCredentialDto, CredentialTemplate } from '../Credential.types';
import GeneralInfoDropdown from '../EditCredential/CredentialAttribute/CredentialDetails/GeneralInfoDropdown';
import { getInitialCredentialData } from '../EditCredential/EditCredential.utils';

interface CreateGeneralInfoProps {
    onClose: () => void;
    onAdd: (credential: CreateCredentialDto) => void;
    open?: boolean;
}

const tempCollections = [
    { name: 'Kolekcja Basi', id: 'kolekcja_basi' },
    { name: 'Kolekcja Ady', id: 'kolekcja_ady' },
    { name: 'Kolekcja Stasia', id: 'kolekcja_stasia' },
    { name: 'Kolekcja Asi', id: 'kolekcja_asi' }
];

export const CreateGeneralInfo: FC<CreateGeneralInfoProps> = ({ onClose, onAdd, open }) => {
    const { translate } = useTranslations();
    const [credentialFormState, setCredentialFormState] = useState<CreateCredentialDto>(getInitialCredentialData());
    const [formValidationState, setFormValidationState] = useState<{ [key: string]: boolean }>({
        name: false,
        description: false,
        collectionId: false,
        template: true
    });
    const checkIsFormValid = () => Object.values(formValidationState).every(Boolean);
    const { enqueueSnackbar } = useSnackbar();


    console.log(formValidationState);
    console.log(credentialFormState);

    const closeDialog = () => {
        onClose();
    };

    const handleSubmit = () => {
        try {
            if (!checkIsFormValid()) {
                enqueueSnackbar('cos poszlo nie tak', { variant: 'error' });
                return;
            }

            onAdd(credentialFormState);
        } catch (error) {}
    };

    // change to take this from state
    const credentialsCollections = tempCollections;

    // get this from db
    const templates = Object.values(CredentialTemplate);

    const collectionsToChoose = credentialsCollections.map(collection => (
        <MenuItem key={collection.id} value={collection.name}>
            <Typography>{collection.name}</Typography>
        </MenuItem>
    ));

    const templatesToChoose = templates.map(template => (
        <MenuItem key={template} value={template}>
            <Typography>{template}</Typography>
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
            const foundCollection = credentialsCollections.find(collection => collection.name === value);

            changeTo = foundCollection.id;
        }
        setCredentialFormState((prevState) => ({
            ...prevState,
            [name]: changeTo
        }));
        setFormValidationState((prevState) => ({
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
                                selectLabel={translate('Credentials.Tab.Collections')}
                                tooltipText={translate('Credential.Details.Dislaimer.Text')}
                                selectOptions={collectionsToChoose}
                                selectedValue={credentialFormState.collectionId}
                                handleChange={(event: SelectChangeEvent) => handleDropdownChange('collectionId', event.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <GeneralInfoDropdown
                                selectLabel={translate('Credential.Details.Template.Label')}
                                tooltipText={translate('Credential.Details.Template.Info')}
                                selectOptions={templatesToChoose}
                                selectedValue={credentialFormState.template}
                                handleChange={(event: SelectChangeEvent) => handleDropdownChange('template', event.target.value)}
                                required
                            />
                        </Grid>
                    </Grid>
                </Form>
            </Content>
        </CustomDialog>
    );
};
