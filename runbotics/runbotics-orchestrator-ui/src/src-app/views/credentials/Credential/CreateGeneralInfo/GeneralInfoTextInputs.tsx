import { Dispatch, FC, SetStateAction } from 'react';

import { Grid, TextField } from '@mui/material';

import useTranslations from '#src-app/hooks/useTranslations';

import { CreateCredentialDto } from '../Credential.types';
import { CredentialFormValidationState, inputErrorMessages } from '../EditCredential/EditCredential.utils';

interface GeneralInfoTextFieldsProps {
    credentialFormState: CreateCredentialDto;
    setCredentialFormState: Dispatch<SetStateAction<CreateCredentialDto>>;
    formValidationState: CredentialFormValidationState;
    setFormValidationState: Dispatch<SetStateAction<CredentialFormValidationState>>;

}

export const GeneralInfoTextFields: FC<GeneralInfoTextFieldsProps> = ({
    credentialFormState,
    setCredentialFormState,
    formValidationState,
    setFormValidationState
}) => {
    const { translate } = useTranslations();
    const helperText = formValidationState.edited &&
        !formValidationState.name &&
        inputErrorMessages.NAME_IS_REQUIRED;
    const isErrored = formValidationState.edited && !formValidationState.name;

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

    return (
        <>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label={translate('Credential.Details.Name.Label')}
                    required
                    name="name"
                    InputLabelProps={{ shrink: true }}
                    value={credentialFormState.name}
                    onChange={handleInputChange}
                    error={isErrored}
                    helperText={helperText}
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
        </>
    );
};
